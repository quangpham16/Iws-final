/**
 * Smart Transaction Parser
 * Parses natural-language transaction descriptions into structured data.
 *
 * Rules:
 *  - Amount shorthand: 'k' = ×1 000, 'tr' = ×1 000 000
 *  - Type: inferred from keywords (default → EXPENSE)
 *  - Category: exactly one from the fixed list
 *  - Tags: up to three contextual tags
 *  - Note: concise ≤5-word summary
 */

const CATEGORIES = [
    'Food & Dining',
    'Housing & Utilities',
    'Transportation',
    'Shopping',
    'Education',
    'Entertainment',
    'Health & Fitness',
    'Financial',
    'Income',
];

// ── keyword → category mapping ──────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
    'Food & Dining': [
        'coffee','cafe','latte','cappuccino','tea','boba',
        'lunch','dinner','breakfast','brunch','meal','food',
        'restaurant','eat','eating','dine','dining','grocery','groceries',
        'pizza','burger','sushi','noodle','pho','rice','chicken',
        'snack','dessert','cake','bread','milk','juice','beer','wine',
        'cook','takeout','delivery','grab food','gofood',
    ],
    'Housing & Utilities': [
        'rent','mortgage','electricity','electric','water','gas','internet',
        'wifi','cable','phone bill','utility','utilities','maintenance',
        'repair','plumber','cleaning','laundry','furniture','appliance',
        'home','house','apartment','condo',
    ],
    'Transportation': [
        'uber','grab','lyft','taxi','cab','bus','train','metro','subway',
        'flight','airline','ticket','parking','toll','fuel','petrol',
        'gasoline','car','motorbike','motorcycle','bike','commute','travel',
        'trip','ride',
    ],
    'Shopping': [
        'buy','bought','purchase','shop','shopping','amazon','shopee','lazada',
        'clothes','clothing','shoes','sneakers','fashion','accessory','accessories',
        'electronics','gadget','phone','laptop','tablet','watch',
        'gift','present','order','delivery',
    ],
    'Education': [
        'tuition','course','class','school','university','college','book','books',
        'textbook','training','workshop','seminar','conference','certification',
        'exam','study','learn','learning','udemy','coursera','tutorial',
    ],
    'Entertainment': [
        'movie','film','cinema','netflix','spotify','youtube','disney',
        'game','gaming','playstation','xbox','steam','concert','show',
        'festival','party','club','bar','karaoke','music','subscription',
        'streaming','hbo','hulu',
    ],
    'Health & Fitness': [
        'gym','fitness','workout','exercise','yoga','run','running',
        'doctor','hospital','clinic','dentist','dental','medicine','pharmacy',
        'drug','vitamin','supplement','health','insurance','therapy',
        'mental','checkup','surgery','ambulance',
    ],
    'Financial': [
        'transfer','invest','investment','stock','crypto','bitcoin','eth',
        'loan','debt','credit','fee','bank','atm','tax','interest',
        'saving','savings','deposit','withdraw','exchange','forex',
        'insurance','premium',
    ],
    'Income': [
        'salary','wage','paycheck','freelance','bonus','refund','dividend',
        'interest earned','sold','revenue','commission','tip','tips',
        'reimbursement','cashback','allowance','stipend','grant','prize',
        'winning','payout','income','pay day','payday',
    ],
};

// ── income keywords (override type to INCOME) ──────────────────────────────
const INCOME_KEYWORDS = [
    'salary','wage','paycheck','freelance','bonus','refund','dividend',
    'interest earned','sold','revenue','commission','reimbursement',
    'cashback','allowance','stipend','grant','prize','winning',
    'payout','income','received','earn','earned','pay day','payday',
];

// ── tag inference rules ─────────────────────────────────────────────────────
const TAG_RULES = [
    { tag: '#need',             keywords: ['rent','mortgage','electricity','water','gas','internet','grocery','groceries','medicine','pharmacy','insurance','utility','utilities','fuel','petrol','commute','doctor','hospital','tuition','school'] },
    { tag: '#want',             keywords: ['coffee','cafe','latte','boba','movie','netflix','spotify','game','gaming','shopping','clothes','shoes','sneakers','concert','party','bar','club','karaoke','dessert','snack','beer','wine','restaurant','dining','gift'] },
    { tag: '#recurring',        keywords: ['salary','rent','mortgage','subscription','netflix','spotify','gym','insurance','internet','phone bill','electricity','water','monthly','weekly','paycheck','wage','hulu','disney','hbo'] },
    { tag: '#one_time',         keywords: ['gift','trip','repair','surgery','concert','festival','purchase','bought','vacation','holiday','wedding','birthday'] },
    { tag: '#business_expense', keywords: ['office','client','meeting','conference','business','coworking','laptop','software','domain','hosting','ads','marketing'] },
    { tag: '#leisure',          keywords: ['vacation','holiday','trip','travel','movie','game','concert','festival','party','spa','resort','beach','cruise'] },
];

// ── helpers ─────────────────────────────────────────────────────────────────

/** Convert shorthand amount strings: '50k' → 50000, '2tr' → 2000000 */
function parseAmount(raw) {
    if (!raw) return null;
    const s = raw.toString().trim().toLowerCase().replace(/[,$\s]/g, '');
    const m = s.match(/^(\d+(?:\.\d+)?)\s*(tr|m|k)?$/i);
    if (!m) return null;
    let num = parseFloat(m[1]);
    const suffix = (m[2] || '').toLowerCase();
    if (suffix === 'k')  num *= 1_000;
    if (suffix === 'm')  num *= 1_000_000;
    if (suffix === 'tr') num *= 1_000_000;
    return Math.round(num);
}

/** Score each category by keyword hits; return best match */
function detectCategory(text) {
    const lower = text.toLowerCase();
    let best = 'Shopping'; // sensible fallback
    let bestScore = 0;

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        let score = 0;
        for (const kw of keywords) {
            if (lower.includes(kw)) score += kw.length;   // longer match = more specific
        }
        if (score > bestScore) { bestScore = score; best = cat; }
    }
    return best;
}

/** Detect if the transaction is income */
function detectType(text) {
    const lower = text.toLowerCase();
    for (const kw of INCOME_KEYWORDS) {
        if (lower.includes(kw)) return 'INCOME';
    }
    return 'EXPENSE';
}

/** Pick up to 3 relevant tags */
function detectTags(text) {
    const lower = text.toLowerCase();
    const matched = [];
    for (const rule of TAG_RULES) {
        for (const kw of rule.keywords) {
            if (lower.includes(kw)) { matched.push(rule.tag); break; }
        }
    }
    return [...new Set(matched)].slice(0, 3);
}

/** Generate a short note (≤5 words) from the raw input */
function generateNote(text) {
    // Strip amounts & punctuation, keep meaningful words
    const cleaned = text
        .replace(/\d+(\.\d+)?\s*(k|tr|m)?\b/gi, '')
        .replace(/[^\w\s]/g, '')
        .trim()
        .split(/\s+/)
        .filter(w => w.length > 1)
        .slice(0, 5)
        .join(' ');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) || 'Transaction';
}

// ── main parser ─────────────────────────────────────────────────────────────

/**
 * Parse a natural-language transaction description.
 *
 * @param {string} input  – e.g. "coffee 50k", "salary 2tr", "uber ride 120k"
 * @returns {{ type, amount, category, tags, note }}
 */
export function parseTransaction(input) {
    if (!input || !input.trim()) return null;

    const text = input.trim();

    // Extract amount — find patterns like 50k, 2tr, 1500, 2.5m
    const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(k|tr|m)?/i);
    const amount = amountMatch ? parseAmount(amountMatch[0]) : null;

    const type     = detectType(text);
    const category = type === 'INCOME' ? 'Income' : detectCategory(text);
    const tags     = detectTags(text);
    const note     = generateNote(text);

    return { type, amount, category, tags, note };
}

export { CATEGORIES };

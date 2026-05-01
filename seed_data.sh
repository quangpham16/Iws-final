#!/bin/bash

BASE_URL="http://localhost:8080/api"

# 1. Register/Login User
echo "Authenticating user..."
USER_RES=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"hoa@verdant.com", "password":"123456", "fullName":"Nguyen Van Hoa"}')

USER_ID=$(echo $USER_RES | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")

if [ -z "$USER_ID" ] || [ "$USER_ID" == "None" ]; then
    USER_RES=$(curl -s -X POST $BASE_URL/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"hoa@verdant.com", "password":"123456"}')
    USER_ID=$(echo $USER_RES | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")
fi

echo "User ID: $USER_ID"

api_post() {
    curl -s -X POST "$BASE_URL$1" \
    -H "X-User-Id: $USER_ID" \
    -H "Content-Type: application/json" \
    -d "$2" > /dev/null
}

# 2. Add Payees
echo "Adding payees..."
api_post "/payees" '{"name":"Starbucks Coffee", "website":"https://starbucks.com", "notes":"Frequent coffee stops"}'
api_post "/payees" '{"name":"Apple Store", "website":"https://apple.com", "notes":"Tech hardware"}'
api_post "/payees" '{"name":"Amazon", "website":"https://amazon.com"}'
api_post "/payees" '{"name":"Netflix", "website":"https://netflix.com"}'
api_post "/payees" '{"name":"Techcombank", "notes":"Bank transfers"}'

# 3. Add Tags
echo "Adding tags..."
api_post "/tags" '{"name":"Work", "colorHex":"#3b82f6"}'
api_post "/tags" '{"name":"Urgent", "colorHex":"#ef4444"}'
api_post "/tags" '{"name":"Family", "colorHex":"#ec4899"}'
api_post "/tags" '{"name":"Gift", "colorHex":"#8b5cf6"}'

# 4. Add Wallets
echo "Adding wallets..."
api_post "/wallets" '{"name":"Main Wallet", "balance":5000000, "currency":"VND"}'
api_post "/wallets" '{"name":"Savings Account", "balance":50000000, "currency":"VND"}'

# 5. Add Categories
echo "Adding categories..."
api_post "/categories" '{"name":"Food & Drink", "type":"expense", "colorHex":"#ef4444"}'
api_post "/categories" '{"name":"Shopping", "type":"expense", "colorHex":"#f59e0b"}'
api_post "/categories" '{"name":"Transportation", "type":"expense", "colorHex":"#3b82f6"}'
api_post "/categories" '{"name":"Salary", "type":"income", "colorHex":"#10b981"}'

# 6. Add Transactions
echo "Adding transactions..."
api_post "/transactions" '{"title":"Monthly Salary", "amount":25000000, "type":"INCOME", "category":"Salary", "date":"2026-04-01"}'
api_post "/transactions" '{"title":"Freelance", "amount":5000000, "type":"INCOME", "category":"Salary", "date":"2026-04-10"}'
api_post "/transactions" '{"title":"Grocery", "amount":1200000, "type":"EXPENSE", "category":"Food & Drink", "date":"2026-04-02"}'
api_post "/transactions" '{"title":"Starbucks", "amount":65000, "type":"EXPENSE", "category":"Food & Drink", "date":"2026-04-05"}'
api_post "/transactions" '{"title":"Gas", "amount":500000, "type":"EXPENSE", "category":"Transportation", "date":"2026-04-03"}'
api_post "/transactions" '{"title":"Rent", "amount":8000000, "type":"EXPENSE", "category":"Housing", "date":"2026-04-05"}'
api_post "/transactions" '{"title":"Nike", "amount":2500000, "type":"EXPENSE", "category":"Shopping", "date":"2026-04-07"}'

# 7. Add Budgets
echo "Adding budgets..."
api_post "/budgets" '{"name":"Food Budget", "periodType":"monthly", "startDate":"2026-04-01", "endDate":"2026-04-30"}'

# 8. Add Goals
echo "Adding goals..."
api_post "/goals" '{"name":"iPhone 16", "targetAmount":30000000, "currentAmount":5000000, "targetDate":"2026-12-31", "colorHex":"#6366f1"}'

echo "Seeding complete!"

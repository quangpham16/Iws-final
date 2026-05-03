import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, MapPin, Briefcase, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const jobs = [
  {
    title: 'Kế Toán Tổng Hợp',
    department: 'Finance',
    location: 'Hà Nội, Vietnam',
    type: 'Full-time',
    description: 'Chúng tôi đang tìm kiếm một Kế Toán Tổng Hợp để quản lý sổ sách kế toán, đối soát ngân hàng và lập báo cáo tài chính cho Verdant Wealth.',
    requirements: [
      'Tốt nghiệp Đại học chuyên ngành Kế toán / Tài chính',
      'Có kinh nghiệm từ 1 năm trở lên (ưu tiên lĩnh vực fintech)',
      'Thành thạo Excel, phần mềm kế toán (MISA, SAP, hoặc tương đương)',
      'Hiểu biết về thuế, luật kế toán Việt Nam',
      'Cẩn thận, trung thực, có tinh thần trách nhiệm cao',
    ],
    benefits: [
      'Mức lương cạnh tranh, thưởng theo hiệu suất',
      'Được làm việc trong môi trường startup trẻ, năng động',
      'Cơ hội phát triển nghề nghiệp cùng công ty',
      'Bảo hiểm xã hội đầy đủ, nghỉ phép linh hoạt',
    ],
  },
];

const values = [
  { icon: Zap, title: 'Move Fast', desc: 'We ship weekly. Your ideas can be in production within days, not months.' },
  { icon: Wallet, title: 'Own Your Work', desc: 'No micromanagement. You own features end-to-end, from concept to deployment.' },
  { icon: CheckCircle2, title: 'Grow Together', desc: 'We invest in your growth — conferences, courses, and mentorship from founders.' },
];

export default function CareersPage() {
  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition-all">
            <div className="w-8 h-8 bg-[#106E4E] rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Wallet size={16} />
            </div>
            <span className="text-xl font-black tracking-tight">Verdant</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#106E4E] transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Careers</p>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-6">
            Build the future of <span className="text-[#106E4E]">wealth tech.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Join a small, ambitious team of builders creating the next generation of financial tools. We're based in Hanoi and we're just getting started.
          </p>
        </div>
      </section>

      {/* Why Verdant */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Why join us</p>
            <h2 className="text-4xl font-black tracking-tighter">More than just a job.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#106E4E] mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-[#106E4E] uppercase tracking-[0.3em] mb-4">Open Positions</p>
            <h2 className="text-4xl font-black tracking-tighter">Current openings.</h2>
          </div>

          <div className="space-y-8">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">
                        <Briefcase size={10} /> {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">
                        <MapPin size={10} /> {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#106E4E] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
                        <Clock size={10} /> {job.type}
                      </span>
                    </div>
                  </div>
                  <a href="mailto:careers@verdantwealth.com" className="flex-shrink-0">
                    <button className="bg-[#106E4E] text-white font-black px-6 py-3 rounded-2xl hover:bg-[#0d5a3f] transition-all shadow-lg shadow-[#106E4E]/20 hover:-translate-y-0.5 flex items-center gap-2 text-sm">
                      Apply Now <ArrowRight size={14} />
                    </button>
                  </a>
                </div>

                <p className="text-gray-600 font-medium mb-8 leading-relaxed">{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Requirements</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                          <CheckCircle2 size={14} className="text-[#106E4E] mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Benefits</h4>
                    <ul className="space-y-2">
                      {job.benefits.map((ben, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          {ben}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 font-medium mb-2">Don't see a perfect fit?</p>
            <p className="text-gray-400 text-sm font-medium">
              Send your CV to <a href="mailto:careers@verdantwealth.com" className="text-[#106E4E] font-bold hover:underline">careers@verdantwealth.com</a> and tell us how you'd contribute.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

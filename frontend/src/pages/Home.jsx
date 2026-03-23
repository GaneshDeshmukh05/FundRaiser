import { Link } from 'react-router-dom';
import { Gift, Users, TrendingUp, Shield, ArrowRight, Star, Zap } from 'lucide-react';

const OCCASIONS = ['Birthday', 'Farewell', 'Wedding', 'Anniversary', 'Graduation', 'Retirement'];

const FEATURES = [
  { icon: Gift, title: 'Create in Seconds', desc: 'Set your gift, target amount, and deadline. Done.', color: 'from-primary-500 to-primary-600' },
  { icon: Users, title: 'Invite Contributors', desc: 'Share a unique link with everyone in the group.', color: 'from-accent-400 to-accent-600' },
  { icon: TrendingUp, title: 'Track in Real-time', desc: 'Watch contributions roll in with live updates.', color: 'from-emerald-400 to-teal-600' },
  { icon: Shield, title: 'Organizer Dashboard', desc: 'Confirm payments, edit details, export CSV.', color: 'from-amber-400 to-orange-600' },
];

const STEPS = [
  { num: '01', title: 'Create', desc: 'Set up your fundraiser with a gift name, target, and deadline.' },
  { num: '02', title: 'Share', desc: 'Copy the unique link and send it to your group.' },
  { num: '03', title: 'Collect', desc: 'Members contribute with their preferred payment method.' },
  { num: '04', title: 'Gift!', desc: 'Hit your target and buy the perfect gift together.' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-primary-950/20" />
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-200/40 dark:bg-accent-900/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 border border-primary-200 dark:border-primary-800">
              <Zap className="w-3.5 h-3.5" />
              Group gift fundraising made simple
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              The perfect gift,{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                funded together
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Create a group gift fundraiser, share the link, and let everyone contribute seamlessly.
              No awkward reminders. No messy spreadsheets.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create" className="btn-primary text-base px-8 py-4 animate-pulse-glow">
                Start a Fundraiser <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <div className="flex -space-x-2">
                  {['A','T','R','S','P'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white dark:border-slate-950 flex items-center justify-center text-white text-xs font-bold">
                      {l}
                    </div>
                  ))}
                </div>
                <span>Trusted by many groups</span>
              </div>
            </div>

            {/* Occasion chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
              {OCCASIONS.map(o => (
                <span key={o} className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm shadow-sm">
                  {o === 'Birthday' ? '🎂' : o === 'Farewell' ? '👋' : o === 'Wedding' ? '💍' : o === 'Anniversary' ? '💕' : o === 'Graduation' ? '🎓' : '🏆'} {o}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Simple tools to coordinate a group gift without the stress.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How it works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-100 dark:from-primary-900 dark:to-primary-950" />
                )}
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25 relative z-10">
                    <span className="text-white font-bold text-sm">{s.num}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card p-12 text-center bg-gradient-to-br from-primary-600 to-accent-600 border-0 shadow-2xl shadow-primary-500/20">
          <Star className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to plan the perfect gift?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">Create your fundraiser in under a minute and let the contributions come in.</p>
          <Link to="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            Create Fundraiser <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">GroupGift</span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">© 2026 GroupGift. Make every gift special.</p>
        </div>
      </footer>
    </main>
  );
}

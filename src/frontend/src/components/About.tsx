import { Award, CheckCircle, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";

const values = [
  "Transparency in every transaction and report",
  "Security with full property registration for loans",
  "Professional SEBI-registered portfolio management",
  "Empowering small investors with institutional access",
  "Community-driven MLM growth network",
];

const milestones = [
  { value: "12+", label: "Years of Excellence" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "₹50Cr+", label: "Assets Under Management" },
  { value: "5K+", label: "Network Members" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* ── Left: narrative ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="text-gold font-semibold tracking-[0.18em] uppercase text-[11px] mb-3">
              Who We Are
            </p>
            <h2 className="text-3xl lg:text-4xl font-black uppercase text-navy tracking-wide mb-5 leading-tight">
              About Maithreya
            </h2>
            <div className="w-12 h-1 bg-gold rounded-full mb-7" />

            <p className="text-muted-foreground leading-relaxed mb-4 text-[15px]">
              Maithreya Investors and Developers is a leading finance and real
              estate company dedicated to democratising wealth creation. We pool
              capital from hundreds of investors to build professionally
              managed, diversified portfolios — giving every individual access
              to institutional-grade investment opportunities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-[15px]">
              Our innovative Multi-Level Marketing network empowers business
              developers, team leaders, marketing managers and directors to grow
              their wealth while expanding the community — creating a
              sustainable ecosystem of financial growth and real estate
              security.
            </p>

            <div className="space-y-3 mb-10">
              {values.map((v) => (
                <div key={v} className="flex items-center gap-3">
                  <CheckCircle className="text-gold shrink-0" size={17} />
                  <span className="text-[14px] text-foreground">{v}</span>
                </div>
              ))}
            </div>

            {/* Milestones strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {milestones.map((m) => (
                <div
                  key={m.label}
                  className="bg-section-bg rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-black text-navy">{m.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 leading-tight">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: cards ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Leadership spotlight */}
            <div className="relative bg-navy rounded-2xl p-7 overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -right-4 -bottom-6 w-28 h-28 rounded-full bg-gold/10" />
              <div className="relative flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gold flex items-center justify-center shrink-0">
                  <Award className="text-navy" size={26} />
                </div>
                <div>
                  <p className="text-gold text-[10px] font-bold uppercase tracking-widest mb-1">
                    Founder &amp; Managing Director
                  </p>
                  <h3 className="text-white font-black text-xl leading-tight mb-2">
                    B Narayana Reddy
                  </h3>
                  <p className="text-white/70 text-[13px] leading-relaxed">
                    With over 12 years of expertise in finance and real estate,
                    Mr. Reddy has built Maithreya from the ground up into a
                    trusted investment platform serving thousands of investors
                    across India.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-section-bg rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                  <TrendingUp size={16} className="text-gold" />
                </div>
                <h3 className="text-navy font-bold uppercase tracking-wider text-sm">
                  Our Mission
                </h3>
              </div>
              <p className="text-muted-foreground text-[14px] leading-relaxed">
                To make professional investment management accessible to every
                Indian investor — regardless of wealth level — through pooled
                funds, expert management, and transparent reporting.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gold/8 border border-gold/20 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gold/25 flex items-center justify-center">
                  <Users size={16} className="text-gold" />
                </div>
                <h3 className="text-navy font-bold uppercase tracking-wider text-sm">
                  Our Vision
                </h3>
              </div>
              <p className="text-muted-foreground text-[14px] leading-relaxed">
                To become India's most trusted community-driven investment
                platform, where every member of our network shares in the
                prosperity of a professionally managed, diversified portfolio.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

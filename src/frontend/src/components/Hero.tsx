import { Button } from "@/components/ui/button";
import { Building2, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { icon: TrendingUp, value: "₹50Cr+", label: "Assets Managed" },
  { icon: Shield, value: "5,000+", label: "Happy Investors" },
  { icon: Building2, value: "200+", label: "Properties Secured" },
];

export default function Hero() {
  return (
    <section className="min-h-[92vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* ── Left content panel ─────────────────────────── */}
      <div className="relative flex items-center bg-white dot-grid">
        {/* Gold accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-light via-gold to-transparent" />

        <motion.div
          className="relative z-10 px-10 lg:px-14 xl:px-20 py-20 pl-12"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 bg-gold/10 border border-gold/25 rounded-full px-4 py-1.5 mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] font-semibold text-gold uppercase tracking-[0.18em]">
              Trusted Finance &amp; Real Estate Since 2010
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-[42px] lg:text-[56px] xl:text-[64px] font-black uppercase leading-[1.02] text-navy mb-2">
            Grow Your
          </h1>
          <h1 className="text-[42px] lg:text-[56px] xl:text-[64px] font-black uppercase leading-[1.02] mb-2">
            <span className="text-gold-gradient">Wealth</span>
          </h1>
          <h1 className="text-[42px] lg:text-[56px] xl:text-[64px] font-black uppercase leading-[1.02] text-navy mb-7">
            With Confidence
          </h1>

          {/* Body */}
          <p className="text-[15px] lg:text-base text-muted-foreground leading-relaxed mb-8 max-w-[420px]">
            Pool your capital with hundreds of investors to access
            professionally managed, diversified portfolios of stocks, bonds
            &amp; securities. Property-secured loans with full title
            registration in the financier's name.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            <a href="/#services">
              <Button
                className="bg-gold text-navy font-bold text-[13px] h-12 px-8 rounded-md shadow-gold hover:brightness-110 hover:-translate-y-0.5 transition-all"
                data-ocid="hero.primary_button"
              >
                Explore Opportunities
              </Button>
            </a>
            <a href="/#investment-mlm">
              <Button
                variant="outline"
                className="h-12 px-8 border-navy/30 text-navy font-semibold text-[13px] rounded-md hover:bg-navy hover:text-white hover:border-navy transition-all"
                data-ocid="hero.secondary_button"
              >
                Our Network
              </Button>
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 border-t border-border/60 pt-7">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                  <Icon className="text-gold" size={16} />
                </div>
                <div className="font-black text-xl lg:text-2xl text-navy tracking-tight">
                  {value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right image panel ──────────────────────────── */}
      <motion.div
        className="relative overflow-hidden min-h-[420px] lg:min-h-full"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/assets/generated/hero-skyline.dim_800x600.jpg"
          alt="Modern financial district skyline"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-navy-dark/20 to-transparent" />

        {/* Floating trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-6 right-6 lg:left-8 lg:right-8"
        >
          <div className="bg-white/12 backdrop-blur-md border border-white/20 rounded-xl p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={18} className="text-navy" />
              </div>
              <div>
                <p className="font-bold text-gold text-xs uppercase tracking-widest mb-1">
                  100% Secured Investment
                </p>
                <p className="text-sm text-white/85 leading-relaxed">
                  All property loans secured with full title registration in the
                  financier's name — zero risk to investors.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Corner accent */}
        <div className="absolute top-6 right-6 text-right">
          <div className="bg-gold/90 backdrop-blur-sm text-navy text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
            SEBI Registered
          </div>
        </div>
      </motion.div>
    </section>
  );
}

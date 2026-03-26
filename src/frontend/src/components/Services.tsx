import { ArrowUpRight, Home, PieChart, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    num: "01",
    icon: TrendingUp,
    title: "Investment Pooling",
    description:
      "Pool capital from multiple investors to build a diversified portfolio of stocks, bonds, mutual funds and securities — spreading risk intelligently across asset classes.",
    features: [
      "Min. ₹10,000 entry",
      "Monthly returns",
      "Transparent reporting",
    ],
    accent: "from-gold/15 to-gold/5",
  },
  {
    num: "02",
    icon: PieChart,
    title: "Portfolio Management",
    description:
      "Professionally managed portfolios tailored to your risk appetite. Our SEBI-registered managers optimise asset allocation for maximum liquidity and risk-adjusted returns.",
    features: [
      "SEBI-registered managers",
      "Real-time portfolio tracking",
      "Risk-adjusted strategy",
    ],
    accent: "from-blue-50 to-transparent",
  },
  {
    num: "03",
    icon: Home,
    title: "Property-Secured Loans",
    description:
      "Access high-value loans backed by property registration. The property title is registered in the financier's name until full repayment — absolute security for every rupee.",
    features: [
      "Competitive interest rates",
      "Full title registration",
      "Flexible repayment tenure",
    ],
    accent: "from-amber-50/60 to-transparent",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-section-bg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold tracking-[0.18em] uppercase text-[11px] mb-3">
            What We Offer
          </p>
          <h2 className="text-3xl lg:text-4xl font-black uppercase text-navy tracking-wide leading-tight">
            Our Core Services
          </h2>
          <div className="mt-4 w-12 h-1 bg-gold rounded-full" />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                data-ocid={`services.item.${i + 1}`}
              >
                {/* Top gold accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-gold via-gold-light to-gold" />

                {/* Gradient bg behind icon */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 p-7 flex flex-col flex-1">
                  {/* Number + icon row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="text-gold" size={26} />
                    </div>
                    <span className="text-5xl font-black text-navy/6 leading-none">
                      {service.num}
                    </span>
                  </div>

                  <h3 className="font-bold text-[18px] text-navy mb-3 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                    {service.description}
                  </p>

                  {/* Feature pills */}
                  <ul className="space-y-1.5 mb-6">
                    {service.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs text-foreground/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Learn more link */}
                  <div className="flex items-center gap-1 text-[13px] font-semibold text-navy group-hover:text-gold transition-colors mt-auto">
                    Learn More
                    <ArrowUpRight
                      size={15}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

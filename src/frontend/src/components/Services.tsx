import {
  ArrowUpRight,
  BarChart2,
  Building,
  Home,
  PieChart,
  Shield,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import type { Service } from "../backend";
import { useAllServices } from "../hooks/useQueries";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  TrendingUp,
  PieChart,
  Home,
  BarChart2,
  Shield,
  Building,
};

const ACCENTS = [
  "from-gold/15 to-gold/5",
  "from-blue-50 to-transparent",
  "from-amber-50/60 to-transparent",
  "from-emerald-50/60 to-transparent",
  "from-purple-50/60 to-transparent",
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: "default-1",
    iconName: "TrendingUp",
    title: "Investment Pooling",
    description:
      "Pool capital from multiple investors to build a diversified portfolio of stocks, bonds, mutual funds and securities — spreading risk intelligently across asset classes.",
    features: [
      "Min. ₹10,000 entry",
      "Monthly returns",
      "Transparent reporting",
    ],
    order: BigInt(1),
  },
  {
    id: "default-2",
    iconName: "PieChart",
    title: "Portfolio Management",
    description:
      "Professionally managed portfolios tailored to your risk appetite. Our SEBI-registered managers optimise asset allocation for maximum liquidity and risk-adjusted returns.",
    features: [
      "SEBI-registered managers",
      "Real-time portfolio tracking",
      "Risk-adjusted strategy",
    ],
    order: BigInt(2),
  },
  {
    id: "default-3",
    iconName: "Home",
    title: "Property-Secured Loans",
    description:
      "Access high-value loans backed by property registration. The property title is registered in the financier's name until full repayment — absolute security for every rupee.",
    features: [
      "Competitive interest rates",
      "Full title registration",
      "Flexible repayment tenure",
    ],
    order: BigInt(3),
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = ICON_MAP[service.iconName] ?? TrendingUp;
  const accent = ACCENTS[index % ACCENTS.length];
  const num = String(Number(service.order)).padStart(2, "0");

  return (
    <motion.article
      className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-ocid={`services.item.${index + 1}`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-gold via-gold-light to-gold" />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative z-10 p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Icon className="text-gold" size={26} />
          </div>
          <span className="text-5xl font-black text-navy/6 leading-none">
            {num}
          </span>
        </div>
        <h3 className="font-bold text-[18px] text-navy mb-3 leading-tight">
          {service.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
          {service.description}
        </p>
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
}

export default function Services() {
  const { data: backendServices = [] } = useAllServices();
  const services =
    backendServices.length > 0
      ? [...backendServices].sort((a, b) => Number(a.order) - Number(b.order))
      : DEFAULT_SERVICES;

  return (
    <section id="services" className="py-24 bg-section-bg">
      <div className="container mx-auto px-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { toast } from "sonner";
import { InquiryStatus, InquiryType } from "../backend.d";
import { useSubmitInquiry } from "../hooks/useQueries";

function generateId() {
  return `ftrinq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const quickLinks = [
  { label: "Home", href: "/#" },
  { label: "Our Services", href: "/#services" },
  { label: "About Us", href: "/#about" },
  { label: "Investment MLM", href: "/#investment-mlm" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Admin Panel", href: "/admin" },
];

export default function Footer() {
  const { mutateAsync, isPending } = useSubmitInquiry();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: generateId(),
        name: form.name,
        email: form.email,
        phone: "",
        inquiryType: InquiryType.investment,
        message: form.message,
        status: InquiryStatus.pending,
        createdAt: BigInt(Date.now()),
      });
      toast.success("Message sent! We'll be in touch shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    }
  };

  const year = new Date().getFullYear();
  const utm = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-navy-dark text-white">
      {/* Top gold rule */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ── Col 1: Brand + contact ────────────────────── */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center font-black text-navy text-lg">
                M
              </div>
              <div>
                <div className="font-black tracking-[0.18em] uppercase text-sm">
                  MAITHREYA
                </div>
                <div className="text-[10px] text-gold/80 tracking-wider uppercase">
                  Investors &amp; Developers
                </div>
              </div>
            </div>

            <p className="text-white/60 text-[13px] leading-relaxed mb-6 max-w-[260px]">
              Building wealth through pooled investments, expert portfolio
              management, and property-secured loans across India.
            </p>

            {/* Contact info */}
            <ul className="space-y-3 mb-7">
              {[
                {
                  Icon: MapPin,
                  text: "123 Business Avenue, Financial District, Hyderabad",
                },
                { Icon: Phone, text: "+91 98765 43210" },
                { Icon: Mail, text: "info@maithreyainvestors.com" },
              ].map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 text-[13px] text-white/65"
                >
                  <Icon size={15} className="text-gold mt-0.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { Icon: SiFacebook, href: "#", label: "Facebook" },
                { Icon: SiX, href: "#", label: "X/Twitter" },
                { Icon: SiLinkedin, href: "#", label: "LinkedIn" },
                { Icon: SiInstagram, href: "#", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-gold hover:text-navy flex items-center justify-center transition-all"
                  data-ocid="footer.link"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Quick links ────────────────────────── */}
          <div>
            <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] text-gold/90 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-white/60 hover:text-gold transition-colors flex items-center gap-1.5 group"
                    data-ocid="footer.link"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* MD highlight */}
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-gold/70 mb-1">
                Managing Director
              </p>
              <p className="font-bold text-white text-sm">B Narayana Reddy</p>
              <p className="text-[12px] text-white/50 mt-0.5">
                Founder &amp; Chief Executive
              </p>
            </div>
          </div>

          {/* ── Col 3: Quick contact form ─────────────────── */}
          <div>
            <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] text-gold/90 mb-5">
              Quick Contact
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                placeholder="Your Name"
                className="h-10 bg-white/8 border-white/15 text-white text-sm placeholder:text-white/35 focus-visible:ring-gold focus-visible:border-gold/50 rounded-lg"
                data-ocid="footer.input"
              />
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                placeholder="Your Email"
                className="h-10 bg-white/8 border-white/15 text-white text-sm placeholder:text-white/35 focus-visible:ring-gold focus-visible:border-gold/50 rounded-lg"
                data-ocid="footer.input"
              />
              <Textarea
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
                placeholder="Your Message"
                rows={3}
                className="bg-white/8 border-white/15 text-white text-sm placeholder:text-white/35 focus-visible:ring-gold focus-visible:border-gold/50 rounded-lg resize-none"
                data-ocid="footer.textarea"
              />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 bg-gold text-navy font-bold text-sm rounded-lg hover:brightness-110 transition-all shadow-gold"
                data-ocid="footer.submit_button"
              >
                {isPending ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/8 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-white/40">
          <span>
            © {year} Maithreya Investors and Developers. All rights reserved.
          </span>
          <span>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/60 hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

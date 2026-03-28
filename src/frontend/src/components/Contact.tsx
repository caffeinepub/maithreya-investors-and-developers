import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { InquiryStatus, InquiryType } from "../backend.d";
import { useCompanyInfo } from "../hooks/useCompanyInfo";
import { useSubmitInquiry } from "../hooks/useQueries";

function generateId() {
  return `inq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Contact() {
  const { mutateAsync, isPending } = useSubmitInquiry();
  const { info } = useCompanyInfo();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: InquiryType.investment as InquiryType,
    amount: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: generateId(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        inquiryType: form.inquiryType,
        amount: form.amount ? BigInt(form.amount) : undefined,
        message: form.message,
        status: InquiryStatus.pending,
        createdAt: BigInt(Date.now()),
      });
      toast.success(
        "Inquiry submitted successfully! We'll contact you shortly.",
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        inquiryType: InquiryType.investment,
        amount: "",
        message: "",
      });
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-20 bg-section-bg">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-2">
            Get In Touch
          </p>
          <h2 className="text-3xl lg:text-4xl font-black uppercase text-navy tracking-wide">
            Contact Us
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-navy rounded-2xl p-8 text-white">
              <h3 className="text-gold font-bold text-lg mb-5 uppercase tracking-wide">
                Reach Us
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-gold text-xs uppercase font-semibold mb-1">
                    Address
                  </div>
                  <div className="text-white/80">{info.address}</div>
                </div>
                <div>
                  <div className="text-gold text-xs uppercase font-semibold mb-1">
                    Phone
                  </div>
                  <div className="text-white/80">
                    +91 {info.phone1}
                    {info.phone2 ? ` / +91 ${info.phone2}` : ""}
                  </div>
                </div>
                <div>
                  <div className="text-gold text-xs uppercase font-semibold mb-1">
                    Email
                  </div>
                  <div className="text-white/80">{info.email}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h4 className="font-bold text-navy mb-3">Investment Minimums</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Portfolio Investment</span>
                  <span className="font-semibold text-navy">₹10,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Property-Secured Loan</span>
                  <span className="font-semibold text-navy">₹5 Lakh+</span>
                </div>
                <div className="flex justify-between">
                  <span>MLM Network Entry</span>
                  <span className="font-semibold text-navy">Free</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-card p-8 space-y-5"
            data-ocid="contact.panel"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-name">Full Name</Label>
                <Input
                  id="c-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="Your name"
                  data-ocid="contact.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-phone">Phone</Label>
                <Input
                  id="c-phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  placeholder="+91 xxxxxxxxxx"
                  data-ocid="contact.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                placeholder="your@email.com"
                data-ocid="contact.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Inquiry Type</Label>
              <Select
                value={form.inquiryType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, inquiryType: v as InquiryType }))
                }
              >
                <SelectTrigger data-ocid="contact.select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InquiryType.investment}>
                    Investment
                  </SelectItem>
                  <SelectItem value={InquiryType.loanApplication}>
                    Loan Application
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.inquiryType === InquiryType.investment && (
              <div className="space-y-1.5">
                <Label htmlFor="c-amount">Investment Amount (₹)</Label>
                <Input
                  id="c-amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="e.g. 50000"
                  data-ocid="contact.input"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="c-message">Message</Label>
              <Textarea
                id="c-message"
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
                placeholder="Tell us about your investment goals..."
                rows={4}
                data-ocid="contact.textarea"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold text-navy font-bold py-6 rounded-lg hover:brightness-110 transition-all"
              data-ocid="contact.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Inquiry"
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

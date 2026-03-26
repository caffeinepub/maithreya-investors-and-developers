import { Badge } from "@/components/ui/badge";
import { BedDouble, MapPin, Maximize2 } from "lucide-react";
import { motion } from "motion/react";
import type { Property } from "../backend";
import { useAllProperties } from "../hooks/useQueries";

const statusConfig: Record<string, { label: string; class: string }> = {
  Available: {
    label: "Available",
    class: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  "Under Negotiation": {
    label: "Under Negotiation",
    class: "bg-amber-100 text-amber-800 border-amber-200",
  },
  Sold: {
    label: "Sold",
    class: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

const typeConfig: Record<string, string> = {
  Residential: "bg-blue-50 text-blue-700 border-blue-200",
  Commercial: "bg-purple-50 text-purple-700 border-purple-200",
  Land: "bg-green-50 text-green-700 border-green-200",
  Plot: "bg-orange-50 text-orange-700 border-orange-200",
};

function PropertyCard({
  property,
  index,
}: { property: Property; index: number }) {
  const status = statusConfig[property.status] ?? statusConfig.Available;
  const typeClass =
    typeConfig[property.propertyType] ??
    "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <motion.article
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-ocid={`properties.item.${index + 1}`}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-gold via-gold-light to-gold" />

      {/* Image or gradient placeholder */}
      {property.imageUrl ? (
        <div className="h-48 overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-navy/10 to-gold/10 flex items-center justify-center">
          <span className="text-5xl opacity-20">🏢</span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${typeClass}`}
          >
            {property.propertyType}
          </span>
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${status.class}`}
          >
            {status.label}
          </span>
        </div>

        <h3 className="font-bold text-navy text-lg leading-snug mb-1">
          {property.title}
        </h3>

        {/* Price */}
        <p className="text-gold font-black text-2xl mb-3">{property.price}</p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
          <MapPin size={13} className="text-gold shrink-0" />
          {property.location}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
          {property.description}
        </p>

        {/* Details row */}
        {(property.area || property.bedrooms !== undefined) && (
          <div className="flex items-center gap-4 pt-3 border-t border-border/50">
            {property.area && (
              <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                <Maximize2 size={12} className="text-gold" />
                {property.area}
              </div>
            )}
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                <BedDouble size={12} className="text-gold" />
                {String(property.bedrooms)} BHK
              </div>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function Properties() {
  const { data: allProperties = [] } = useAllProperties();
  const properties = allProperties.filter(
    (p) => p.status === "Available" || p.status === "Under Negotiation",
  );

  return (
    <section id="properties" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold tracking-[0.18em] uppercase text-[11px] mb-3">
            Real Estate
          </p>
          <h2 className="text-3xl lg:text-4xl font-black uppercase text-navy tracking-wide leading-tight">
            Our Properties
          </h2>
          <div className="mt-4 w-12 h-1 bg-gold rounded-full" />
        </motion.div>

        {properties.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            data-ocid="properties.empty_state"
          >
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">🏡</span>
            </div>
            <h3 className="font-bold text-navy text-xl mb-2">
              Premium Properties Coming Soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We are curating an exclusive portfolio of residential and
              commercial properties. Check back soon or contact us to get early
              access.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

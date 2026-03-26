import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Crown, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Member } from "../backend.d";
import { Role } from "../backend.d";
import { useFullHierarchy } from "../hooks/useQueries";

// ── Role visual config ─────────────────────────────────────────────────────
type RoleCfg = {
  label: string;
  cardBg: string;
  cardBorder: string;
  nameCls: string;
  badgeBg: string;
  badgeText: string;
  avatarBg: string;
  avatarText: string;
  minWidth: string;
};

const ROLE_CFG: Record<string, RoleCfg> = {
  [Role.managingDirector]: {
    label: "Managing Director",
    cardBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    cardBorder: "border-yellow-300/60 shadow-gold",
    nameCls: "text-navy font-black text-base",
    badgeBg: "bg-navy/20",
    badgeText: "text-navy",
    avatarBg: "bg-navy/25",
    avatarText: "text-navy font-black",
    minWidth: "min-w-[200px]",
  },
  [Role.director]: {
    label: "Director",
    cardBg: "bg-gradient-to-br from-slate-700 to-slate-800",
    cardBorder: "border-slate-600/50",
    nameCls: "text-white font-bold text-sm",
    badgeBg: "bg-white/15",
    badgeText: "text-white/90",
    avatarBg: "bg-white/20",
    avatarText: "text-white font-bold",
    minWidth: "min-w-[160px]",
  },
  [Role.marketingManager]: {
    label: "Mktg. Manager",
    cardBg: "bg-gradient-to-br from-blue-900 to-navy",
    cardBorder: "border-blue-700/40",
    nameCls: "text-white font-semibold text-sm",
    badgeBg: "bg-gold/20",
    badgeText: "text-gold",
    avatarBg: "bg-gold/20",
    avatarText: "text-gold font-bold",
    minWidth: "min-w-[150px]",
  },
  [Role.teamLeader]: {
    label: "Team Leader",
    cardBg: "bg-gradient-to-br from-amber-50 to-orange-50",
    cardBorder: "border-amber-200",
    nameCls: "text-amber-900 font-semibold text-sm",
    badgeBg: "bg-amber-200",
    badgeText: "text-amber-800",
    avatarBg: "bg-amber-200",
    avatarText: "text-amber-800 font-bold",
    minWidth: "min-w-[140px]",
  },
  [Role.bizDev]: {
    label: "Biz Dev",
    cardBg: "bg-white",
    cardBorder: "border-gray-200",
    nameCls: "text-gray-700 font-medium text-sm",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-600",
    avatarBg: "bg-gray-100",
    avatarText: "text-gray-600 font-semibold",
    minWidth: "min-w-[130px]",
  },
};

// ── Fallback static demo tree ──────────────────────────────────────────────
const DEMO_MEMBERS: Member[] = [
  {
    id: "md-1",
    name: "B Narayana Reddy",
    role: Role.managingDirector,
    email: "",
    phone: "",
    createdAt: 0n,
  },
  // Directors
  {
    id: "dir-1",
    name: "Rajesh Kumar",
    role: Role.director,
    parentId: "md-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "dir-2",
    name: "Priya Sharma",
    role: Role.director,
    parentId: "md-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "dir-3",
    name: "Venkat Reddy",
    role: Role.director,
    parentId: "md-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "dir-4",
    name: "Anitha Devi",
    role: Role.director,
    parentId: "md-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  // MMs under dir-1
  {
    id: "mm-1",
    name: "Suresh Menon",
    role: Role.marketingManager,
    parentId: "dir-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "mm-2",
    name: "Kavita Rao",
    role: Role.marketingManager,
    parentId: "dir-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "mm-3",
    name: "Deepak Nair",
    role: Role.marketingManager,
    parentId: "dir-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "mm-4",
    name: "Priti Gupta",
    role: Role.marketingManager,
    parentId: "dir-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  // TLs under mm-1
  {
    id: "tl-1",
    name: "Arjun Patel",
    role: Role.teamLeader,
    parentId: "mm-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "tl-2",
    name: "Neha Singh",
    role: Role.teamLeader,
    parentId: "mm-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "tl-3",
    name: "Rahul Dev",
    role: Role.teamLeader,
    parentId: "mm-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "tl-4",
    name: "Sunita Kumari",
    role: Role.teamLeader,
    parentId: "mm-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  // BizDevs under tl-1
  {
    id: "bd-1",
    name: "Amit Sharma",
    role: Role.bizDev,
    parentId: "tl-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "bd-2",
    name: "Pooja Nair",
    role: Role.bizDev,
    parentId: "tl-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
  {
    id: "bd-3",
    name: "Kiran Rao",
    role: Role.bizDev,
    parentId: "tl-1",
    email: "",
    phone: "",
    createdAt: 0n,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function buildTree(members: Member[]): Map<string | undefined, Member[]> {
  const map = new Map<string | undefined, Member[]>();
  for (const m of members) {
    const key = m.parentId ?? undefined;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return map;
}

// ── Node component ─────────────────────────────────────────────────────────
function MemberNode({
  member,
  childMap,
  depth,
  isDemo,
}: {
  member: Member;
  childMap: Map<string | undefined, Member[]>;
  depth: number;
  isDemo: boolean;
}) {
  const children = childMap.get(member.id) ?? [];
  const [expanded, setExpanded] = useState(depth < 2);
  const cfg = ROLE_CFG[member.role] ?? ROLE_CFG[Role.bizDev];
  const isMD = member.role === Role.managingDirector;

  return (
    <div className="flex flex-col items-center">
      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`
          relative ${cfg.minWidth} border-2 ${cfg.cardBg} ${cfg.cardBorder}
          rounded-2xl shadow-card overflow-visible
          ${children.length > 0 ? "cursor-pointer" : ""}
          ${isMD ? "ring-4 ring-yellow-300/40 shadow-gold" : ""}
        `}
        onClick={() => children.length > 0 && setExpanded(!expanded)}
      >
        <div className="p-4">
          {/* Crown for MD */}
          {isMD && (
            <div className="flex justify-center mb-2">
              <Crown className="text-navy/70" size={22} />
            </div>
          )}

          {/* Avatar + info */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-xl ${cfg.avatarBg} flex items-center justify-center text-sm ${cfg.avatarText}`}
            >
              {getInitials(member.name)}
            </div>
            <div className="text-center">
              <div
                className={`${cfg.nameCls} leading-tight truncate max-w-[160px]`}
              >
                {member.name}
              </div>
              <span
                className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
              >
                {cfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Expand / collapse button */}
        {children.length > 0 && (
          <button
            type="button"
            className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-border shadow-card flex items-center justify-center z-10 hover:border-gold transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
            data-ocid="mlm.toggle"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronUp size={13} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={13} className="text-muted-foreground" />
            )}
          </button>
        )}
      </motion.div>

      {/* ── Children ── */}
      <AnimatePresence>
        {expanded && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center overflow-visible"
          >
            {/* Vertical stem */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-gold/60 to-gold/20" />

            {/* Horizontal connector bar */}
            {children.length > 1 && (
              <div
                className="relative flex items-center justify-center"
                style={{ width: "100%" }}
              >
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              </div>
            )}

            {/* Children row */}
            <div className="flex gap-5 xl:gap-7 items-start mt-0">
              {children.map((child, idx) => (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                  data-ocid={`mlm.item.${idx + 1}`}
                >
                  <div className="w-0.5 h-6 bg-gold/30" />
                  <MemberNode
                    member={child}
                    childMap={childMap}
                    depth={depth + 1}
                    isDemo={isDemo}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
export default function MLMTree() {
  const { data: liveMembers, isLoading } = useFullHierarchy();

  const { childMap, roots, isDemo } = useMemo(() => {
    const source =
      liveMembers && liveMembers.length > 0 ? liveMembers : DEMO_MEMBERS;
    const demo = !liveMembers || liveMembers.length === 0;
    const map = buildTree(source);
    const roots = (map.get(undefined) ?? []).filter(
      (m) => m.role === Role.managingDirector,
    );
    return { childMap: map, roots, isDemo: demo };
  }, [liveMembers]);

  return (
    <section id="investment-mlm" className="py-24 bg-section-bg">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold tracking-[0.18em] uppercase text-[11px] mb-3">
            MLM Chart
          </p>
          <h2 className="text-3xl lg:text-4xl font-black uppercase text-navy tracking-wide">
            Our Investment Hierarchy
          </h2>
          <div className="mt-4 mx-auto w-12 h-1 bg-gold rounded-full" />
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Led by <strong className="text-navy">B Narayana Reddy</strong>, our
            community-driven network spans MD → 4 Directors → 4 Marketing
            Managers → 4 Team Leaders → unlimited Business Developers.
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {Object.values(ROLE_CFG).map((cfg) => (
            <div
              key={cfg.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold
                ${cfg.avatarBg} ${cfg.badgeText} border-current/20`}
            >
              <Users size={11} />
              {cfg.label}
            </div>
          ))}
        </div>

        {/* Demo badge */}
        {isDemo && !isLoading && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-xs font-semibold px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Preview — showing sample hierarchy. Initialize from Admin Panel to
              load live data.
            </div>
          </div>
        )}

        {/* Tree */}
        <div className="overflow-x-auto pb-8">
          <div className="min-w-max mx-auto px-4">
            {isLoading ? (
              <div
                className="flex flex-col items-center gap-5"
                data-ocid="mlm.loading_state"
              >
                <Skeleton className="h-24 w-52 rounded-2xl" />
                <div className="flex gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 w-40 rounded-2xl" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                {roots.map((root) => (
                  <MemberNode
                    key={root.id}
                    member={root}
                    childMap={childMap}
                    depth={0}
                    isDemo={isDemo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

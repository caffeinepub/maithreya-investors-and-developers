import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  LogIn,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InquiryStatus, Role } from "../backend.d";
import type { Member, SalaryRecord, UpdateMemberInput } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllInquiries,
  useAllSalaryRecords,
  useCreateMember,
  useDistributeSalaries,
  useFullHierarchy,
  useInitialize,
  useIsCallerAdmin,
  useUpdateInquiryStatus,
  useUpdateMember,
} from "../hooks/useQueries";

const roleLabels: Record<string, string> = {
  [Role.managingDirector]: "Managing Director",
  [Role.director]: "Director",
  [Role.marketingManager]: "Marketing Manager",
  [Role.teamLeader]: "Team Leader",
  [Role.bizDev]: "Business Developer",
};

const statusColors: Record<string, string> = {
  [InquiryStatus.pending]: "bg-yellow-100 text-yellow-800",
  [InquiryStatus.reviewed]: "bg-blue-100 text-blue-800",
  [InquiryStatus.contacted]: "bg-green-100 text-green-800",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateId() {
  return `mem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function AddMemberDialog({ members }: { members: Member[] }) {
  const { mutateAsync, isPending } = useCreateMember();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    designation: "",
    joiningDate: "",
    role: Role.bizDev as Role,
    parentId: "",
  });

  const eligibleParents = members.filter((m) => {
    if (form.role === Role.director) return m.role === Role.managingDirector;
    if (form.role === Role.marketingManager) return m.role === Role.director;
    if (form.role === Role.teamLeader) return m.role === Role.marketingManager;
    if (form.role === Role.bizDev) return m.role === Role.teamLeader;
    return false;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: generateId(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address || undefined,
        designation: form.designation || undefined,
        joiningDate: form.joiningDate || undefined,
        role: form.role,
        parentId: form.parentId || undefined,
        createdAt: BigInt(Date.now()),
      });
      toast.success("Member added successfully!");
      setOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        designation: "",
        joiningDate: "",
        role: Role.bizDev,
        parentId: "",
      });
    } catch {
      toast.error("Failed to add member.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gold text-navy font-bold"
          data-ocid="admin.open_modal_button"
        >
          <Plus className="mr-2" size={16} /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Member name"
              data-ocid="admin.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                placeholder="email@example.com"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                required
                placeholder="+91 xxx"
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Street, City, State"
              data-ocid="admin.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Designation</Label>
              <Input
                value={form.designation}
                onChange={(e) =>
                  setForm((p) => ({ ...p, designation: e.target.value }))
                }
                placeholder="e.g. Senior Manager"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Joining Date</Label>
              <Input
                type="date"
                value={form.joiningDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, joiningDate: e.target.value }))
                }
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, role: v as Role, parentId: "" }))
              }
            >
              <SelectTrigger data-ocid="admin.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels)
                  .filter(([k]) => k !== Role.managingDirector)
                  .map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {eligibleParents.length > 0 && (
            <div className="space-y-1.5">
              <Label>Reports To</Label>
              <Select
                value={form.parentId}
                onValueChange={(v) => setForm((p) => ({ ...p, parentId: v }))}
              >
                <SelectTrigger data-ocid="admin.select">
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleParents.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({roleLabels[m.role]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-navy text-white"
              data-ocid="admin.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditMemberDialog({ member }: { member: Member }) {
  const { mutateAsync, isPending } = useUpdateMember();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UpdateMemberInput>({
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    address: member.address ?? "",
    photoUrl: member.photoUrl,
    designation: member.designation ?? "",
    joiningDate: member.joiningDate ?? "",
  });

  const handleOpen = (val: boolean) => {
    if (val) {
      setForm({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        address: member.address ?? "",
        photoUrl: member.photoUrl,
        designation: member.designation ?? "",
        joiningDate: member.joiningDate ?? "",
      });
    }
    setOpen(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        ...form,
        address: form.address || undefined,
        designation: form.designation || undefined,
        joiningDate: form.joiningDate || undefined,
      });
      toast.success("Member updated successfully!");
      setOpen(false);
    } catch {
      toast.error("Failed to update member.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-navy"
          data-ocid="admin.edit_button"
        >
          <Pencil size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Member name"
              data-ocid="admin.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                placeholder="email@example.com"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                required
                placeholder="+91 xxx"
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              value={form.address ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Street, City, State"
              data-ocid="admin.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Designation</Label>
              <Input
                value={form.designation ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, designation: e.target.value }))
                }
                placeholder="e.g. Senior Manager"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Joining Date</Label>
              <Input
                type="date"
                value={form.joiningDate ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, joiningDate: e.target.value }))
                }
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-navy text-white"
              data-ocid="admin.save_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type SalaryRow = {
  memberId: string;
  name: string;
  role: string;
  designation: string;
  amount: string;
  notes: string;
};

function SalaryDistributeTab({ members }: { members: Member[] }) {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [rows, setRows] = useState<SalaryRow[]>([]);
  const { mutateAsync: distribute, isPending } = useDistributeSalaries();

  // Sync rows when members change
  useEffect(() => {
    setRows(
      members.map((m) => ({
        memberId: m.id,
        name: m.name,
        role: m.role,
        designation: m.designation ?? "",
        amount: "",
        notes: "",
      })),
    );
  }, [members]);

  const updateRow = (idx: number, field: "amount" | "notes", value: string) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    );
  };

  const handleDistribute = async () => {
    const entries = rows
      .filter((r) => r.amount !== "" && Number(r.amount) > 0)
      .map((r) => ({
        memberId: r.memberId,
        amount: BigInt(Math.round(Number(r.amount))),
        notes: r.notes || undefined,
      }));

    if (entries.length === 0) {
      toast.error("Please enter salary amounts for at least one member.");
      return;
    }

    try {
      await distribute({
        month: BigInt(Number(month)),
        year: BigInt(Number(year)),
        entries,
      });
      toast.success("Salaries distributed successfully!");
      setRows((prev) => prev.map((r) => ({ ...r, amount: "", notes: "" })));
    } catch {
      toast.error("Failed to distribute salaries.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5">
          <Label>Month</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40" data-ocid="salary.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, i) => (
                <SelectItem key={name} value={String(i + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Year</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-28"
            min={2020}
            max={2100}
            data-ocid="salary.input"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table data-ocid="salary.table">
          <TableHeader>
            <TableRow className="bg-navy/5">
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Salary Amount (₹)</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.memberId} data-ocid={`salary.item.${idx + 1}`}>
                <TableCell className="text-muted-foreground text-sm">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {roleLabels[row.role] || row.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.designation || (
                    <span className="italic opacity-40">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={row.amount}
                      onChange={(e) => updateRow(idx, "amount", e.target.value)}
                      className="pl-7 w-36"
                      placeholder="0"
                      data-ocid="salary.input"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    value={row.notes}
                    onChange={(e) => updateRow(idx, "notes", e.target.value)}
                    placeholder="Optional note"
                    className="w-44"
                    data-ocid="salary.input"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleDistribute}
          disabled={isPending}
          className="bg-gold text-navy font-bold px-8"
          data-ocid="salary.primary_button"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Distributing...
            </>
          ) : (
            "Distribute All"
          )}
        </Button>
      </div>
    </div>
  );
}

function SalaryHistoryTab() {
  const { data: records = [], isLoading } = useAllSalaryRecords();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="salary.loading_state"
      >
        <Loader2 className="animate-spin text-gold" size={30} />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div
        className="text-center text-muted-foreground py-16"
        data-ocid="salary.empty_state"
      >
        No salary records yet. Use the Distribute tab to pay salaries.
      </div>
    );
  }

  // Group by year/month descending
  const groups: Record<string, SalaryRecord[]> = {};
  for (const r of records) {
    const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  const sortedKeys = Object.keys(groups).sort((a, b) => (a > b ? -1 : 1));

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      {sortedKeys.map((key) => {
        const groupRecords = groups[key];
        const [yr, mo] = key.split("-");
        const monthName = MONTH_NAMES[Number(mo) - 1];
        const total = groupRecords.reduce(
          (sum, r) => sum + Number(r.amount),
          0,
        );
        const isOpen = openGroups[key] ?? false;

        return (
          <Collapsible
            key={key}
            open={isOpen}
            onOpenChange={() => toggleGroup(key)}
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 bg-navy/5 hover:bg-navy/10 rounded-xl transition-colors border border-navy/10"
                data-ocid="salary.panel"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-navy">
                    {monthName} {yr}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {groupRecords.length} payments
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gold">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground" />
                  )}
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border border-t-0 border-navy/10 rounded-b-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-navy/3">
                      <TableHead>Member Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupRecords.map((r, idx) => (
                      <TableRow key={r.id} data-ocid={`salary.row.${idx + 1}`}>
                        <TableCell className="font-medium">
                          {r.memberName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {roleLabels[r.memberRole] || r.memberRole}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-700">
                          ₹{Number(r.amount).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {r.notes || (
                            <span className="italic opacity-40">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(Number(r.distributedAt)).toLocaleDateString(
                            "en-IN",
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: members = [], isLoading: membersLoading } = useFullHierarchy();
  const { data: inquiries = [], isLoading: inquiriesLoading } =
    useAllInquiries();
  const { mutateAsync: initialize, isPending: initPending } = useInitialize();
  const { mutateAsync: updateStatus } = useUpdateInquiryStatus();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isAdmin && !initialized && !actorFetching) {
      initialize()
        .then(() => setInitialized(true))
        .catch(() => setInitialized(true));
    }
  }, [isAdmin, initialized, actorFetching, initialize]);

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    try {
      await updateStatus({ id, status });
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-section-bg flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-card p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-5">
            <LogIn className="text-gold" size={28} />
          </div>
          <h2 className="text-2xl font-black text-navy uppercase mb-2">
            Admin Access
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Log in to access the admin dashboard.
          </p>
          <Button
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-gold text-navy font-bold"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (checkingAdmin || actorFetching) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-section-bg flex items-center justify-center">
        <div
          className="bg-white rounded-2xl shadow-card p-10 text-center max-w-sm w-full"
          data-ocid="admin.error_state"
        >
          <h2 className="text-2xl font-black text-navy mb-3">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have admin privileges.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-gold hover:underline text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section-bg">
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg uppercase tracking-wider">
            Admin Panel
          </h1>
          <p className="text-gold text-xs">
            Maithreya Investors &amp; Developers
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => initialize()}
            disabled={initPending}
            className="border-gold/40 text-gold hover:bg-gold/10"
            data-ocid="admin.secondary_button"
          >
            {initPending ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <RefreshCw size={14} />
            )}
            <span className="ml-2">Re-initialize</span>
          </Button>
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
              data-ocid="admin.link"
            >
              ← Back to Site
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="members" data-ocid="admin.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="members" data-ocid="admin.tab">
              Members
            </TabsTrigger>
            <TabsTrigger value="inquiries" data-ocid="admin.tab">
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="salary" data-ocid="admin.tab">
              💰 Salary Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">
                  Network Members ({members.length})
                </h2>
                <AddMemberDialog members={members} />
              </div>
              {membersLoading ? (
                <div
                  className="flex items-center justify-center py-10"
                  data-ocid="admin.loading_state"
                >
                  <Loader2 className="animate-spin text-gold" size={30} />
                </div>
              ) : members.length === 0 ? (
                <div
                  className="text-center text-muted-foreground py-10"
                  data-ocid="admin.empty_state"
                >
                  No members yet. Click "Add Member" to start building the
                  hierarchy.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Joining Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((m, idx) => (
                        <TableRow
                          key={m.id}
                          data-ocid={`admin.item.${idx + 1}`}
                        >
                          <TableCell className="text-muted-foreground text-sm">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {m.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {roleLabels[m.role] || m.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {m.email}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {m.phone}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">
                            {m.address || (
                              <span className="italic text-muted-foreground/50">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {m.designation || (
                              <span className="italic text-muted-foreground/50">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {m.joiningDate || (
                              <span className="italic text-muted-foreground/50">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <EditMemberDialog member={m} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="font-bold text-navy text-lg mb-5">
                Inquiries ({inquiries.length})
              </h2>
              {inquiriesLoading ? (
                <div
                  className="flex items-center justify-center py-10"
                  data-ocid="admin.loading_state"
                >
                  <Loader2 className="animate-spin text-gold" size={30} />
                </div>
              ) : inquiries.length === 0 ? (
                <div
                  className="text-center text-muted-foreground py-10"
                  data-ocid="admin.empty_state"
                >
                  No inquiries yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Update Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inq, idx) => (
                        <TableRow
                          key={inq.id}
                          data-ocid={`admin.item.${idx + 1}`}
                        >
                          <TableCell className="text-muted-foreground text-sm">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {inq.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {inq.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {inq.inquiryType === "investment"
                                ? "Investment"
                                : "Loan"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inq.status] || ""}`}
                            >
                              {inq.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={inq.status}
                              onValueChange={(v) =>
                                handleStatusChange(inq.id, v as InquiryStatus)
                              }
                            >
                              <SelectTrigger
                                className="w-32 h-8 text-xs"
                                data-ocid="admin.select"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={InquiryStatus.pending}>
                                  Pending
                                </SelectItem>
                                <SelectItem value={InquiryStatus.reviewed}>
                                  Reviewed
                                </SelectItem>
                                <SelectItem value={InquiryStatus.contacted}>
                                  Contacted
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="salary">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="mb-5">
                <h2 className="font-bold text-navy text-lg">
                  Salary Distribution
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Distribute salaries to network members. Only accessible by MD.
                </p>
              </div>
              <Tabs defaultValue="distribute">
                <TabsList className="mb-5">
                  <TabsTrigger value="distribute" data-ocid="salary.tab">
                    Distribute
                  </TabsTrigger>
                  <TabsTrigger value="history" data-ocid="salary.tab">
                    History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="distribute">
                  <SalaryDistributeTab members={members} />
                </TabsContent>
                <TabsContent value="history">
                  <SalaryHistoryTab />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  KeyRound,
  Loader2,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InquiryStatus, Role } from "../backend";
import type { Member, Property, Service, UpdateMemberInput } from "../backend";
import { useActor } from "../hooks/useActor";
import type { SalaryRecord } from "../hooks/useQueries";

import {
  setAdminCredentials,
  useAddAdmin,
  useAddProperty,
  useAllInquiries,
  useAllProperties,
  useAllSalaryRecords,
  useAllServices,
  useChangeAdminPassword,
  useCreateMember,
  useDeleteProperty,
  useDistributeSalaries,
  useFullHierarchy,
  useGetCompanyInfo,
  useInitialize,
  useListAdmins,
  useRemoveAdmin,
  useUpdateCompanyInfo,
  useUpdateInquiryStatus,
  useUpdateMember,
  useUpdateProperty,
  useUpdateServices,
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
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---- Add Member Dialog ----
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

// ---- Edit Member Dialog ----
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
    if (val)
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

// ---- Salary Distribution Tab ----
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

// ---- Salary History Tab ----
function SalaryHistoryTab() {
  const { data: records = [], isLoading } = useAllSalaryRecords();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  if (isLoading)
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="salary.loading_state"
      >
        <Loader2 className="animate-spin text-gold" size={30} />
      </div>
    );
  if (records.length === 0)
    return (
      <div
        className="text-center text-muted-foreground py-16"
        data-ocid="salary.empty_state"
      >
        No salary records yet.
      </div>
    );

  const groups: Record<string, SalaryRecord[]> = {};
  for (const r of records) {
    const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  const sortedKeys = Object.keys(groups).sort((a, b) => (a > b ? -1 : 1));

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
            onOpenChange={() =>
              setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
            }
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
                    <TableRow>
                      <TableHead>Member</TableHead>
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

// ---- Company Info Tab ----
function CompanyInfoTab() {
  const { data: backendInfo, isLoading } = useGetCompanyInfo();
  const { mutateAsync: updateInfo, isPending } = useUpdateCompanyInfo();
  const defaultForm = {
    companyName: "Maithreya Investors and Developers",
    tagline: "Building Wealth Together",
    established: "2020",
    address: "123 Business Avenue, Financial District, Hyderabad",
    phone1: "9951597247",
    phone2: "8247617139",
    email: "reddynarayana11@gmail.com",
    about:
      "Maithreya Investors and Developers is a leading finance and real estate company.",
    mission:
      "To make professional investment management accessible to every Indian investor.",
    vision:
      "To become India's most trusted community-driven investment platform.",
  };
  const [form, setForm] = useState(defaultForm);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (backendInfo && !initialized) {
      setForm({
        companyName: backendInfo.companyName ?? defaultForm.companyName,
        tagline: backendInfo.tagline ?? defaultForm.tagline,
        established: backendInfo.established ?? defaultForm.established,
        address: backendInfo.address ?? defaultForm.address,
        phone1: backendInfo.phone1 ?? defaultForm.phone1,
        phone2: backendInfo.phone2 ?? defaultForm.phone2,
        email: backendInfo.email ?? defaultForm.email,
        about: backendInfo.about ?? defaultForm.about,
        mission: backendInfo.mission ?? defaultForm.mission,
        vision: backendInfo.vision ?? defaultForm.vision,
      });
      setInitialized(true);
    }
  }, [backendInfo, initialized]);

  if (isLoading)
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="company.loading_state"
      >
        <Loader2 className="animate-spin text-gold" size={30} />
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-card p-6 max-w-3xl">
      <h2 className="font-bold text-navy text-lg mb-6">Edit Company Info</h2>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block">Company Name</Label>
            <Input
              value={form.companyName}
              onChange={(e) =>
                setForm((p) => ({ ...p, companyName: e.target.value }))
              }
              data-ocid="company.input"
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Tagline</Label>
            <Input
              value={form.tagline}
              onChange={(e) =>
                setForm((p) => ({ ...p, tagline: e.target.value }))
              }
              data-ocid="company.input"
            />
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block">Address</Label>
          <Input
            value={form.address}
            onChange={(e) =>
              setForm((p) => ({ ...p, address: e.target.value }))
            }
            data-ocid="company.input"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block">Phone 1</Label>
            <Input
              value={form.phone1}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone1: e.target.value }))
              }
              data-ocid="company.input"
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Phone 2</Label>
            <Input
              value={form.phone2}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone2: e.target.value }))
              }
              data-ocid="company.input"
            />
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            data-ocid="company.input"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">About</Label>
          <Textarea
            rows={4}
            value={form.about}
            onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
            data-ocid="company.textarea"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">Mission</Label>
          <Textarea
            rows={3}
            value={form.mission}
            onChange={(e) =>
              setForm((p) => ({ ...p, mission: e.target.value }))
            }
            data-ocid="company.textarea"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">Vision</Label>
          <Textarea
            rows={3}
            value={form.vision}
            onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
            data-ocid="company.textarea"
          />
        </div>
        <Button
          onClick={async () => {
            try {
              await updateInfo(form);
              toast.success("Company info updated!");
            } catch {
              toast.error("Failed to update.");
            }
          }}
          disabled={isPending}
          className="bg-gold text-navy font-bold"
          data-ocid="company.save_button"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}

// ---- Properties Tab ----
type PropertyForm = {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  propertyType: string;
  status: string;
  area: string;
  bedrooms: string;
  imageUrl: string;
};

const emptyPropertyForm = (): PropertyForm => ({
  id: "",
  title: "",
  description: "",
  price: "",
  location: "",
  propertyType: "Residential",
  status: "Available",
  area: "",
  bedrooms: "",
  imageUrl: "",
});

function PropertyDialog({
  property,
  onClose,
}: { property?: Property; onClose: () => void }) {
  const { mutateAsync: addProp, isPending: adding } = useAddProperty();
  const { mutateAsync: updateProp, isPending: updating } = useUpdateProperty();
  const isPending = adding || updating;
  const isEdit = !!property;

  const [form, setForm] = useState<PropertyForm>(() =>
    property
      ? {
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          propertyType: property.propertyType,
          status: property.status,
          area: property.area ?? "",
          bedrooms:
            property.bedrooms !== undefined ? String(property.bedrooms) : "",
          imageUrl: property.imageUrl ?? "",
        }
      : emptyPropertyForm(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prop: Property = {
        id: isEdit ? form.id : generateId(),
        title: form.title,
        description: form.description,
        price: form.price,
        location: form.location,
        propertyType: form.propertyType,
        status: form.status,
        area: form.area || undefined,
        bedrooms: form.bedrooms ? BigInt(form.bedrooms) : undefined,
        imageUrl: form.imageUrl || undefined,
        createdAt: property?.createdAt ?? BigInt(Date.now()),
      };
      if (isEdit) {
        await updateProp(prop);
        toast.success("Property updated!");
      } else {
        await addProp(prop);
        toast.success("Property added!");
      }
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update property." : "Failed to add property.",
      );
    }
  };

  return (
    <DialogContent className="max-w-lg" data-ocid="properties.dialog">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Property" : "Add Property"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            data-ocid="properties.input"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={form.propertyType}
              onValueChange={(v) => setForm((p) => ({ ...p, propertyType: v }))}
            >
              <SelectTrigger data-ocid="properties.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Residential", "Commercial", "Land", "Plot"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
            >
              <SelectTrigger data-ocid="properties.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Available", "Sold", "Under Negotiation"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Price (e.g. ₹45 Lakh)</Label>
            <Input
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              required
              data-ocid="properties.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              required
              data-ocid="properties.input"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Area (e.g. 1200 sq ft)</Label>
            <Input
              value={form.area}
              onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
              data-ocid="properties.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Bedrooms (BHK)</Label>
            <Input
              type="number"
              value={form.bedrooms}
              onChange={(e) =>
                setForm((p) => ({ ...p, bedrooms: e.target.value }))
              }
              min={0}
              data-ocid="properties.input"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            data-ocid="properties.textarea"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Image URL (optional)</Label>
          <Input
            value={form.imageUrl}
            onChange={(e) =>
              setForm((p) => ({ ...p, imageUrl: e.target.value }))
            }
            placeholder="https://..."
            data-ocid="properties.input"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-navy text-white"
            data-ocid="properties.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Property"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="properties.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

function PropertiesTab() {
  const { data: properties = [], isLoading } = useAllProperties();
  const { mutateAsync: deleteProp, isPending: deleting } = useDeleteProperty();
  const [showAdd, setShowAdd] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try {
      await deleteProp(id);
      toast.success("Property deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const statusBadge: Record<string, string> = {
    Available: "bg-emerald-100 text-emerald-800",
    Sold: "bg-slate-100 text-slate-600",
    "Under Negotiation": "bg-amber-100 text-amber-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-navy text-lg">
          Properties ({properties.length})
        </h2>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button
              className="bg-gold text-navy font-bold"
              data-ocid="properties.open_modal_button"
            >
              <Plus className="mr-2" size={16} /> Add Property
            </Button>
          </DialogTrigger>
          {showAdd && <PropertyDialog onClose={() => setShowAdd(false)} />}
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-10"
          data-ocid="properties.loading_state"
        >
          <Loader2 className="animate-spin text-gold" size={30} />
        </div>
      ) : properties.length === 0 ? (
        <div
          className="text-center text-muted-foreground py-10"
          data-ocid="properties.empty_state"
        >
          No properties yet. Click "Add Property" to add your first listing.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table data-ocid="properties.table">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((prop, idx) => (
                <TableRow
                  key={prop.id}
                  data-ocid={`properties.item.${idx + 1}`}
                >
                  <TableCell className="text-muted-foreground text-sm">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{prop.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {prop.propertyType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-gold">
                    {prop.price}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {prop.location}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[prop.status] ?? ""}`}
                    >
                      {prop.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog
                        open={editProperty?.id === prop.id}
                        onOpenChange={(v) => {
                          if (!v) setEditProperty(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-navy"
                            onClick={() => setEditProperty(prop)}
                            data-ocid="properties.edit_button"
                          >
                            <Pencil size={14} />
                          </Button>
                        </DialogTrigger>
                        {editProperty?.id === prop.id && (
                          <PropertyDialog
                            property={editProperty}
                            onClose={() => setEditProperty(null)}
                          />
                        )}
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(prop.id)}
                        disabled={deleting}
                        data-ocid="properties.delete_button"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ---- Services Tab ----
function ServicesTab() {
  const { data: services = [], isLoading } = useAllServices();
  const { mutateAsync: updateServices, isPending } = useUpdateServices();
  const [editList, setEditList] = useState<Service[] | null>(null);

  useEffect(() => {
    if (services.length > 0 && editList === null) {
      setEditList(
        [...services].sort((a, b) => Number(a.order) - Number(b.order)),
      );
    }
  }, [services, editList]);

  const list = editList ?? [];

  const updateField = (idx: number, field: keyof Service, value: string) => {
    setEditList(
      (prev) =>
        prev?.map((s, i) => {
          if (i !== idx) return s;
          if (field === "order")
            return { ...s, order: BigInt(Number(value) || 0) };
          if (field === "features")
            return {
              ...s,
              features: value
                .split("\n")
                .map((f) => f.trim())
                .filter(Boolean),
            };
          return { ...s, [field]: value };
        }) ?? null,
    );
  };

  const addService = () => {
    const newService: Service = {
      id: generateId(),
      title: "",
      description: "",
      features: [],
      iconName: "TrendingUp",
      order: BigInt(list.length + 1),
    };
    setEditList((prev) => [...(prev ?? []), newService]);
  };

  const removeService = (idx: number) => {
    setEditList((prev) => prev?.filter((_, i) => i !== idx) ?? null);
  };

  const handleSave = async () => {
    try {
      await updateServices(list);
      toast.success("Services updated!");
    } catch {
      toast.error("Failed to update services.");
    }
  };

  if (isLoading)
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="services.loading_state"
      >
        <Loader2 className="animate-spin text-gold" size={30} />
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-navy text-lg">Edit Services</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage service cards shown on the homepage.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addService}
          data-ocid="services.open_modal_button"
        >
          <Plus className="mr-2" size={16} /> Add Service
        </Button>
      </div>
      <div className="space-y-6">
        {list.map((service, idx) => (
          <div
            key={service.id}
            className="border rounded-xl p-5 space-y-3 relative"
            data-ocid={`services.item.${idx + 1}`}
          >
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeService(idx)}
                data-ocid="services.delete_button"
              >
                <Trash2 size={14} />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) => updateField(idx, "title", e.target.value)}
                  data-ocid="services.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Order #</Label>
                <Input
                  type="number"
                  value={String(service.order)}
                  onChange={(e) => updateField(idx, "order", e.target.value)}
                  min={1}
                  data-ocid="services.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Icon Name</Label>
                <Input
                  value={service.iconName}
                  onChange={(e) => updateField(idx, "iconName", e.target.value)}
                  placeholder="TrendingUp, PieChart, Home..."
                  data-ocid="services.input"
                />
                <p className="text-[11px] text-muted-foreground">
                  Available: TrendingUp, PieChart, Home, BarChart2, Shield,
                  Building
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={service.description}
                onChange={(e) =>
                  updateField(idx, "description", e.target.value)
                }
                data-ocid="services.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Features (one per line)</Label>
              <Textarea
                rows={3}
                value={service.features.join("\n")}
                onChange={(e) => updateField(idx, "features", e.target.value)}
                placeholder="Feature 1\nFeature 2"
                data-ocid="services.textarea"
              />
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div
            className="text-center text-muted-foreground py-8"
            data-ocid="services.empty_state"
          >
            No services yet. Click "Add Service" to create your first card.
          </div>
        )}
      </div>
      {list.length > 0 && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-gold text-navy font-bold px-8"
            data-ocid="services.save_button"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save All Services"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ---- Admin Settings Tab ----
function AdminSettingsTab({ adminUser }: { adminUser: string }) {
  const {
    data: admins = [],
    isLoading: adminsLoading,
    refetch: refetchAdmins,
  } = useListAdmins();
  const { mutateAsync: addAdmin, isPending: addingAdmin } = useAddAdmin();
  const { mutateAsync: changePassword, isPending: changingPassword } =
    useChangeAdminPassword();
  const { mutateAsync: removeAdmin, isPending: removingAdmin } =
    useRemoveAdmin();

  const [changePwForm, setChangePwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [addAdminForm, setAddAdminForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (changePwForm.newPassword !== changePwForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (changePwForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      await changePassword({
        oldPassword: changePwForm.oldPassword,
        newPassword: changePwForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setChangePwForm({ oldPassword: "", newPassword: "", confirm: "" });
    } catch {
      toast.error("Failed to change password. Check your current password.");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addAdminForm.password !== addAdminForm.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (addAdminForm.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      await addAdmin({
        newUsername: addAdminForm.username,
        newPassword: addAdminForm.password,
      });
      toast.success(`Admin "${addAdminForm.username}" added successfully!`);
      setAddAdminForm({ username: "", password: "", confirm: "" });
      refetchAdmins();
    } catch {
      toast.error("Failed to add admin.");
    }
  };

  const handleRemoveAdmin = async (username: string) => {
    if (!confirm(`Remove admin "${username}"?`)) return;
    try {
      await removeAdmin(username);
      toast.success(`Admin "${username}" removed.`);
    } catch {
      toast.error("Failed to remove admin.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-navy/10 rounded-lg flex items-center justify-center">
            <KeyRound size={18} className="text-navy" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Change Password</h3>
            <p className="text-xs text-muted-foreground">
              Update your admin password
            </p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={changePwForm.oldPassword}
              onChange={(e) =>
                setChangePwForm((p) => ({ ...p, oldPassword: e.target.value }))
              }
              required
              data-ocid="settings.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input
                type="password"
                value={changePwForm.newPassword}
                onChange={(e) =>
                  setChangePwForm((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }))
                }
                required
                minLength={6}
                data-ocid="settings.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={changePwForm.confirm}
                onChange={(e) =>
                  setChangePwForm((p) => ({ ...p, confirm: e.target.value }))
                }
                required
                data-ocid="settings.input"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={changingPassword}
            className="bg-navy text-white"
            data-ocid="settings.submit_button"
          >
            {changingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </div>

      {/* Add Admin */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center">
            <UserPlus size={18} className="text-gold" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Add New Admin</h3>
            <p className="text-xs text-muted-foreground">
              Grant admin access to another person
            </p>
          </div>
        </div>
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Username</Label>
            <Input
              value={addAdminForm.username}
              onChange={(e) =>
                setAddAdminForm((p) => ({ ...p, username: e.target.value }))
              }
              required
              placeholder="New admin username"
              data-ocid="settings.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={addAdminForm.password}
                onChange={(e) =>
                  setAddAdminForm((p) => ({ ...p, password: e.target.value }))
                }
                required
                minLength={6}
                data-ocid="settings.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={addAdminForm.confirm}
                onChange={(e) =>
                  setAddAdminForm((p) => ({ ...p, confirm: e.target.value }))
                }
                required
                data-ocid="settings.input"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={addingAdmin}
            className="bg-gold text-navy font-bold"
            data-ocid="settings.submit_button"
          >
            {addingAdmin ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              "Add Admin"
            )}
          </Button>
        </form>
      </div>

      {/* Manage Admins */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Manage Admins</h3>
            <p className="text-xs text-muted-foreground">
              View and remove admin accounts
            </p>
          </div>
        </div>
        {adminsLoading ? (
          <div
            className="flex items-center justify-center py-6"
            data-ocid="settings.loading_state"
          >
            <Loader2 className="animate-spin text-gold" size={24} />
          </div>
        ) : admins.length === 0 ? (
          <div
            className="text-muted-foreground text-sm py-4 text-center"
            data-ocid="settings.empty_state"
          >
            No admins found.
          </div>
        ) : (
          <div className="space-y-2" data-ocid="settings.list">
            {admins.map((username, idx) => (
              <div
                key={username}
                className="flex items-center justify-between px-4 py-3 bg-muted/40 rounded-lg"
                data-ocid={`settings.item.${idx + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-navy">{username}</span>
                    {username === adminUser && (
                      <span className="ml-2 text-xs text-gold font-semibold">
                        (you)
                      </span>
                    )}
                  </div>
                </div>
                {username !== adminUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveAdmin(username)}
                    disabled={removingAdmin || admins.length <= 1}
                    data-ocid="settings.delete_button"
                  >
                    <Trash2 size={14} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Login Form ----
function AdminLoginForm({
  onVerified,
}: { onVerified: (username: string, password: string) => void }) {
  const { actor } = useActor();
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Backend not ready. Please wait.");
      return;
    }
    setIsSubmitting(true);
    try {
      const valid = await actor.verifyAdminLogin(adminName, password);
      if (valid) {
        setAdminCredentials(adminName, password);
        onVerified(adminName, password);
      } else {
        toast.error("Invalid credentials. Please try again.");
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-section-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-sm overflow-hidden">
        <div className="bg-navy px-8 py-7 text-center">
          <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="text-gold" size={26} />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider">
            Admin Login
          </h1>
          <p className="text-gold/80 text-xs mt-1">
            Maithreya Investors &amp; Developers
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <div className="space-y-1.5">
            <Label
              htmlFor="admin-name"
              className="text-navy font-semibold text-sm"
            >
              Admin Name
            </Label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="admin-name"
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter admin name"
                className="pl-9"
                required
                autoComplete="username"
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="admin-password"
              className="text-navy font-semibold text-sm"
            >
              Password
            </Label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-9"
                required
                autoComplete="current-password"
                data-ocid="admin.input"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !adminName || !password}
            className="w-full bg-gold text-navy font-bold hover:bg-gold/90 mt-2"
            data-ocid="admin.primary_button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Login"
            )}
          </Button>
          <div className="text-center pt-1">
            <Link
              to="/"
              className="text-gold hover:underline text-sm"
              data-ocid="admin.link"
            >
              ← Back to Website
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Main Admin Page ----
export default function Admin() {
  const { data: members = [], isLoading: membersLoading } = useFullHierarchy();
  const { data: inquiries = [], isLoading: inquiriesLoading } =
    useAllInquiries();
  const { mutateAsync: initialize, isPending: initPending } = useInitialize();
  const { mutateAsync: updateStatus } = useUpdateInquiryStatus();
  const [initialized, setInitialized] = useState(false);
  const [credentialsVerified, setCredentialsVerified] = useState(false);
  const [adminUser, setAdminUser] = useState("");

  useEffect(() => {
    if (credentialsVerified && !initialized) {
      initialize()
        .then(() => setInitialized(true))
        .catch(() => setInitialized(true));
    }
  }, [credentialsVerified, initialized, initialize]);

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    try {
      await updateStatus({ id, status });
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  if (!credentialsVerified) {
    return (
      <AdminLoginForm
        onVerified={(username) => {
          setAdminUser(username);
          setCredentialsVerified(true);
        }}
      />
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
            Maithreya Investors &amp; Developers · Logged in as{" "}
            <span className="font-semibold">{adminUser}</span>
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
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="members" data-ocid="admin.tab">
              Members
            </TabsTrigger>
            <TabsTrigger value="inquiries" data-ocid="admin.tab">
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="salary" data-ocid="admin.tab">
              💰 Salary
            </TabsTrigger>
            <TabsTrigger value="properties" data-ocid="admin.tab">
              🏠 Properties
            </TabsTrigger>
            <TabsTrigger value="services" data-ocid="admin.tab">
              ⚙️ Services
            </TabsTrigger>
            <TabsTrigger value="company" data-ocid="admin.tab">
              🏢 Company Info
            </TabsTrigger>
            <TabsTrigger value="settings" data-ocid="admin.tab">
              🔐 Admin Settings
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
                  No members yet.
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
                  Distribute salaries to network members.
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

          <TabsContent value="properties">
            <PropertiesTab />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="company">
            <CompanyInfoTab />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsTab adminUser={adminUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

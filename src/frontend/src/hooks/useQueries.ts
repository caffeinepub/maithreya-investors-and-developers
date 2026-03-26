import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CompanyInfo,
  Inquiry,
  InquiryStatus,
  Member,
  Property,
  SalaryDistributionInput,
  Service,
  UpdateMemberInput,
} from "../backend";
import { useActor } from "./useActor";

// Module-level admin credentials (set after login)
let _adminUsername = "";
let _adminPassword = "";

export function setAdminCredentials(username: string, password: string) {
  _adminUsername = username;
  _adminPassword = password;
}

export function getAdminCredentials() {
  return { username: _adminUsername, password: _adminPassword };
}

// Re-export SalaryRecord from backend types
export type { SalaryRecord } from "../backend";

export function useFullHierarchy() {
  const { actor, isFetching } = useActor();
  return useQuery<Member[]>({
    queryKey: ["fullHierarchy"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFullHierarchy();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ["allInquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (inquiry: Inquiry) => {
      if (!actor) throw new Error("No actor");
      return actor.submitInquiry(inquiry);
    },
  });
}

export function useCreateMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (member: Member) => {
      if (!actor) throw new Error("No actor");
      return actor.createMember(_adminUsername, _adminPassword, member);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fullHierarchy"] });
    },
  });
}

export function useUpdateMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateMemberInput) => {
      if (!actor) throw new Error("No actor");
      return actor.updateMember(_adminUsername, _adminPassword, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fullHierarchy"] });
    },
  });
}

export function useUpdateInquiryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: string; status: InquiryStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateInquiryStatus(
        _adminUsername,
        _adminPassword,
        id,
        status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allInquiries"] });
    },
  });
}

export function useInitialize() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.initialize();
    },
  });
}

export function useAllSalaryRecords() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allSalaryRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSalaryRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDistributeSalaries() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SalaryDistributionInput) => {
      if (!actor) throw new Error("No actor");
      return actor.distributeSalaries(_adminUsername, _adminPassword, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allSalaryRecords"] });
    },
  });
}

export function useGetCompanyInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<CompanyInfo | null>({
    queryKey: ["companyInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompanyInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCompanyInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (info: CompanyInfo) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCompanyInfo(_adminUsername, _adminPassword, info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyInfo"] });
    },
  });
}

// Properties
export function useAllProperties() {
  const { actor, isFetching } = useActor();
  return useQuery<Property[]>({
    queryKey: ["allProperties"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProperties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (property: Property) => {
      if (!actor) throw new Error("No actor");
      return actor.addProperty(_adminUsername, _adminPassword, property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
    },
  });
}

export function useUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (property: Property) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProperty(_adminUsername, _adminPassword, property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
    },
  });
}

export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProperty(_adminUsername, _adminPassword, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
    },
  });
}

// Services
export function useAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["allServices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateServices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (services: Service[]) => {
      if (!actor) throw new Error("No actor");
      return actor.updateServices(_adminUsername, _adminPassword, services);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allServices"] });
    },
  });
}

// Admin management
export function useListAdmins() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["admins", _adminUsername],
    queryFn: async () => {
      if (!actor || !_adminUsername) return [];
      return actor.listAdmins(_adminUsername, _adminPassword);
    },
    enabled: !!actor && !isFetching && !!_adminUsername,
  });
}

export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      newUsername,
      newPassword,
    }: { newUsername: string; newPassword: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addAdmin(
        _adminUsername,
        _adminPassword,
        newUsername,
        newPassword,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useChangeAdminPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: { oldPassword: string; newPassword: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.changeAdminPassword(
        _adminUsername,
        oldPassword,
        newPassword,
      );
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetUsername: string) => {
      if (!actor) throw new Error("No actor");
      return actor.removeAdmin(_adminUsername, _adminPassword, targetUsername);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Inquiry,
  InquiryStatus,
  Member,
  SalaryDistributionInput,
  SalaryRecord,
  UpdateMemberInput,
} from "../backend.d";
import { useActor } from "./useActor";

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

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
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
      return actor.createMember(member);
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
      return actor.updateMember(input);
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
      return actor.updateInquiryStatus(id, status);
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
  return useQuery<SalaryRecord[]>({
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
      return actor.distributeSalaries(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allSalaryRecords"] });
    },
  });
}

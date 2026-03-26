import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SalaryRecord {
    id: string;
    memberId: string;
    month: bigint;
    year: bigint;
    distributedAt: Time;
    memberName: string;
    memberRole: Role;
    notes?: string;
    amount: bigint;
}
export interface UpdateMemberInput {
    id: string;
    name: string;
    photoUrl?: string;
    email: string;
    address?: string;
    phone: string;
    designation?: string;
    joiningDate?: string;
}
export type Time = bigint;
export interface SalaryDistributionInput {
    month: bigint;
    year: bigint;
    entries: Array<{
        memberId: string;
        notes?: string;
        amount: bigint;
    }>;
}
export interface Member {
    id: string;
    name: string;
    createdAt: Time;
    role: Role;
    photoUrl?: string;
    email: string;
    address?: string;
    phone: string;
    parentId?: string;
    designation?: string;
    joiningDate?: string;
}
export interface Inquiry {
    id: string;
    status: InquiryStatus;
    inquiryType: InquiryType;
    name: string;
    createdAt: Time;
    email: string;
    message: string;
    phone: string;
    amount?: bigint;
}
export interface SalaryInput {
    memberId: string;
    month: bigint;
    year: bigint;
    notes?: string;
    amount: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum InquiryStatus {
    pending = "pending",
    contacted = "contacted",
    reviewed = "reviewed"
}
export enum InquiryType {
    investment = "investment",
    loanApplication = "loanApplication"
}
export enum Role {
    managingDirector = "managingDirector",
    director = "director",
    teamLeader = "teamLeader",
    marketingManager = "marketingManager",
    bizDev = "bizDev"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMember(member: Member): Promise<string>;
    distributeSalaries(input: SalaryDistributionInput): Promise<Array<string>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllSalaryRecords(): Promise<Array<SalaryRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChildren(parentId: string): Promise<Array<Member>>;
    getFullHierarchy(): Promise<Array<Member>>;
    getInquiriesByStatus(status: InquiryStatus): Promise<Array<Inquiry>>;
    getMember(id: string): Promise<Member>;
    getSalaryByMonthYear(month: bigint, year: bigint): Promise<Array<SalaryRecord>>;
    getSalaryRecords(memberId: string): Promise<Array<SalaryRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setSalary(input: SalaryInput): Promise<string>;
    submitInquiry(inquiry: Inquiry): Promise<string>;
    updateInquiryStatus(id: string, status: InquiryStatus): Promise<void>;
    updateMember(input: UpdateMemberInput): Promise<void>;
}

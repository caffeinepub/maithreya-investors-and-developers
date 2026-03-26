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
    designation?: string;
    joiningDate?: string;
    photoUrl?: string;
    email: string;
    address?: string;
    phone: string;
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
export interface CompanyInfo {
    about: string;
    mission: string;
    tagline: string;
    established?: string;
    email: string;
    address: string;
    companyName: string;
    vision: string;
    phone1: string;
    phone2: string;
}
export interface Service {
    id: string;
    title: string;
    features: Array<string>;
    order: bigint;
    description: string;
    iconName: string;
}
export interface Property {
    id: string;
    status: string;
    title: string;
    propertyType: string;
    bedrooms?: bigint;
    area?: string;
    createdAt: Time;
    description: string;
    imageUrl?: string;
    price: string;
    location: string;
}
export interface Member {
    id: string;
    name: string;
    designation?: string;
    createdAt: Time;
    role: Role;
    joiningDate?: string;
    photoUrl?: string;
    email: string;
    address?: string;
    phone: string;
    parentId?: string;
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
    addAdmin(callerUsername: string, callerPassword: string, newUsername: string, newPassword: string): Promise<void>;
    addProperty(callerUsername: string, callerPassword: string, property: Property): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(username: string, oldPassword: string, newPassword: string): Promise<void>;
    createMember(callerUsername: string, callerPassword: string, member: Member): Promise<string>;
    deleteProperty(callerUsername: string, callerPassword: string, id: string): Promise<void>;
    distributeSalaries(callerUsername: string, callerPassword: string, input: SalaryDistributionInput): Promise<Array<string>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllProperties(): Promise<Array<Property>>;
    getAllSalaryRecords(): Promise<Array<SalaryRecord>>;
    getAllServices(): Promise<Array<Service>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChildren(parentId: string): Promise<Array<Member>>;
    getCompanyInfo(): Promise<CompanyInfo | null>;
    getFullHierarchy(): Promise<Array<Member>>;
    getInquiriesByStatus(status: InquiryStatus): Promise<Array<Inquiry>>;
    getMember(id: string): Promise<Member | null>;
    getSalaryByMonthYear(month: bigint, year: bigint): Promise<Array<SalaryRecord>>;
    getSalaryRecords(memberId: string): Promise<Array<SalaryRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAdmins(callerUsername: string, callerPassword: string): Promise<Array<string>>;
    removeAdmin(callerUsername: string, callerPassword: string, targetUsername: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setSalary(callerUsername: string, callerPassword: string, input: SalaryInput): Promise<string>;
    submitInquiry(inquiry: Inquiry): Promise<string>;
    updateCompanyInfo(callerUsername: string, callerPassword: string, info: CompanyInfo): Promise<void>;
    updateInquiryStatus(callerUsername: string, callerPassword: string, id: string, status: InquiryStatus): Promise<void>;
    updateMember(callerUsername: string, callerPassword: string, input: UpdateMemberInput): Promise<void>;
    updateProperty(callerUsername: string, callerPassword: string, property: Property): Promise<void>;
    updateServices(callerUsername: string, callerPassword: string, newServices: Array<Service>): Promise<void>;
    verifyAdminLogin(username: string, password: string): Promise<boolean>;
}

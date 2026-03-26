import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type Role = {
    #managingDirector;
    #director;
    #marketingManager;
    #teamLeader;
    #bizDev;
  };

  // Old Member type (without designation/joiningDate)
  type OldMember = {
    id : Text;
    name : Text;
    role : Role;
    email : Text;
    phone : Text;
    address : ?Text;
    photoUrl : ?Text;
    parentId : ?Text;
    createdAt : Time.Time;
  };

  // New Member type (with designation/joiningDate)
  type NewMember = {
    id : Text;
    name : Text;
    role : Role;
    email : Text;
    phone : Text;
    address : ?Text;
    photoUrl : ?Text;
    parentId : ?Text;
    createdAt : Time.Time;
    designation : ?Text;
    joiningDate : ?Text;
  };

  type InquiryType = {
    #investment;
    #loanApplication;
  };

  type InquiryStatus = {
    #pending;
    #reviewed;
    #contacted;
  };

  type Inquiry = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    inquiryType : InquiryType;
    amount : ?Nat;
    message : Text;
    createdAt : Time.Time;
    status : InquiryStatus;
  };

  type SalaryRecord = {
    id : Text;
    memberId : Text;
    memberName : Text;
    memberRole : Role;
    amount : Nat;
    month : Nat;
    year : Nat;
    notes : ?Text;
    distributedAt : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type OldActor = {
    members : Map.Map<Text, OldMember>;
    inquiries : Map.Map<Text, Inquiry>;
    userProfiles : Map.Map<Principal, UserProfile>;
    memberIdCounter : Nat;
    inquiryIdCounter : Nat;
    initialized : Bool;
  };

  type NewActor = {
    members : Map.Map<Text, NewMember>;
    inquiries : Map.Map<Text, Inquiry>;
    userProfiles : Map.Map<Principal, UserProfile>;
    memberIdCounter : Nat;
    inquiryIdCounter : Nat;
    initialized : Bool;
    salaryRecords : Map.Map<Text, SalaryRecord>;
  };

  public func run(old : OldActor) : NewActor {
    // Migrate members: add null designation and joiningDate to each existing member
    let newMembers = Map.empty<Text, NewMember>();
    for ((k, m) in old.members.entries()) {
      let newMember : NewMember = {
        id = m.id;
        name = m.name;
        role = m.role;
        email = m.email;
        phone = m.phone;
        address = m.address;
        photoUrl = m.photoUrl;
        parentId = m.parentId;
        createdAt = m.createdAt;
        designation = null;
        joiningDate = null;
      };
      newMembers.add(k, newMember);
    };
    {
      members = newMembers;
      inquiries = old.inquiries;
      userProfiles = old.userProfiles;
      memberIdCounter = old.memberIdCounter;
      inquiryIdCounter = old.inquiryIdCounter;
      initialized = old.initialized;
      salaryRecords = Map.empty<Text, SalaryRecord>();
    };
  };
};

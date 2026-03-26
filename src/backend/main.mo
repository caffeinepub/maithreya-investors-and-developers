import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Types for hierarchy
  type Role = {
    #managingDirector;
    #director;
    #marketingManager;
    #teamLeader;
    #bizDev;
  };

  type Member = {
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

  // Inquiry types
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

  // Salary distribution types
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

  type SalaryInput = {
    memberId : Text;
    amount : Nat;
    month : Nat;
    year : Nat;
    notes : ?Text;
  };

  type SalaryDistributionInput = {
    entries : [{
      memberId : Text;
      amount : Nat;
      notes : ?Text;
    }];
    month : Nat;
    year : Nat;
  };

  module SalaryRecordArray {
    public func compareByDistributedAt(a : SalaryRecord, b : SalaryRecord) : Order.Order {
      if (a.distributedAt == b.distributedAt) {
        return #equal;
      } else if (a.distributedAt > b.distributedAt) {
        return #less;
      } else {
        return #greater;
      };
    };

    public func compareByAmount(a : SalaryRecord, b : SalaryRecord) : Order.Order {
      Nat.compare(b.amount, a.amount);
    };
  };

  module Inquiry {
    public func compare(i1 : Inquiry, i2 : Inquiry) : Order.Order {
      Text.compare(i1.id, i2.id);
    };
  };

  module Role {
    public func compare(r1 : Role, r2 : Role) : Order.Order {
      switch (r1, r2) {
        case (#managingDirector, #managingDirector) { #equal };
        case (#managingDirector, _) { #less };
        case (#director, #managingDirector) { #greater };
        case (#director, #director) { #equal };
        case (#director, _) { #less };
        case (#marketingManager, #managingDirector) { #greater };
        case (#marketingManager, #director) { #greater };
        case (#marketingManager, #marketingManager) { #equal };
        case (#marketingManager, #teamLeader) { #less };
        case (#marketingManager, #bizDev) { #less };
        case (#teamLeader, #managingDirector) { #greater };
        case (#teamLeader, #director) { #greater };
        case (#teamLeader, #marketingManager) { #greater };
        case (#teamLeader, #teamLeader) { #equal };
        case (#teamLeader, #bizDev) { #less };
        case (#bizDev, #bizDev) { #equal };
        case (#bizDev, _) { #greater };
      };
    };
  };

  module MemberArray {
    public func compareByRoleAndName(a : Member, b : Member) : Order.Order {
      switch (Role.compare(a.role, b.role)) {
        case (#equal) { Text.compare(a.name, b.name) };
        case (order) { order };
      };
    };
  };

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type UpdateMemberInput = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    address : ?Text;
    photoUrl : ?Text;
    designation : ?Text;
    joiningDate : ?Text;
  };

  // State
  let members = Map.empty<Text, Member>();
  let inquiries = Map.empty<Text, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var memberIdCounter = 0;
  var inquiryIdCounter = 0;
  var initialized = false;

  // Salary state
  let salaryRecords = Map.empty<Text, SalaryRecord>();

  // Initialize access control and mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize default Managing Director
  public shared ({ caller }) func initialize() : async () {
    if (initialized) {
      Runtime.trap("Already initialized");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };

    let mdId = "MD-1";
    let md : Member = {
      id = mdId;
      name = "B Narayana Reddy";
      role = #managingDirector;
      email = "ceo@maithreya.com";
      phone = "+1 555-123-4567";
      address = null;
      photoUrl = null;
      parentId = null;
      createdAt = Time.now();
      designation = ?"Managing Director";
      joiningDate = null;
    };
    members.add(mdId, md);
    memberIdCounter := 1;
    initialized := true;
  };

  func countChildrenByRole(parentId : Text, role : Role) : Nat {
    var count = 0;
    for ((_, member) in members.entries()) {
      if (member.parentId == ?parentId and member.role == role) {
        count += 1;
      };
    };
    count;
  };

  public shared ({ caller }) func createMember(member : Member) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create members");
    };

    switch (member.role) {
      case (#managingDirector) {
        var mdCount = 0;
        for ((_, m) in members.entries()) {
          if (m.role == #managingDirector) { mdCount += 1; };
        };
        if (mdCount > 0) { Runtime.trap("Only one Managing Director allowed"); };
      };
      case (#director) {
        switch (member.parentId) {
          case (null) { Runtime.trap("Managing Director parent required for Director") };
          case (?parentId) {
            let parent = members.get(parentId);
            switch (parent) {
              case (null) { Runtime.trap("Parent not found") };
              case (?p) {
                if (p.role != #managingDirector) { Runtime.trap("Parent must be the Managing Director"); };
                let directorCount = countChildrenByRole(parentId, #director);
                if (directorCount >= 4) { Runtime.trap("Max 4 Directors allowed under MD"); };
              };
            };
          };
        };
      };
      case (#marketingManager) {
        switch (member.parentId) {
          case (null) { Runtime.trap("Director parent required for Marketing Manager") };
          case (?parentId) {
            let parent = members.get(parentId);
            switch (parent) {
              case (null) { Runtime.trap("Parent not found") };
              case (?p) {
                if (p.role != #director) { Runtime.trap("Parent must be a Director"); };
                let mmCount = countChildrenByRole(parentId, #marketingManager);
                if (mmCount >= 4) { Runtime.trap("Max 4 Marketing Managers allowed per Director"); };
              };
            };
          };
        };
      };
      case (#teamLeader) {
        switch (member.parentId) {
          case (null) { Runtime.trap("Marketing Manager parent required for Team Leader") };
          case (?parentId) {
            let parent = members.get(parentId);
            switch (parent) {
              case (null) { Runtime.trap("Parent not found") };
              case (?p) {
                if (p.role != #marketingManager) { Runtime.trap("Parent must be a Marketing Manager"); };
                let tlCount = countChildrenByRole(parentId, #teamLeader);
                if (tlCount >= 4) { Runtime.trap("Max 4 Team Leaders allowed per Marketing Manager"); };
              };
            };
          };
        };
      };
      case (#bizDev) {
        switch (member.parentId) {
          case (null) { Runtime.trap("Team Leader parent required for BizDev") };
          case (?parentId) {
            let parent = members.get(parentId);
            switch (parent) {
              case (null) { Runtime.trap("Parent not found") };
              case (?p) {
                if (p.role != #teamLeader) { Runtime.trap("Parent must be a Team Leader"); };
              };
            };
          };
        };
      };
    };

    memberIdCounter += 1;
    let rolePrefix = switch (member.role) {
      case (#managingDirector) { "MD" };
      case (#director) { "DIR" };
      case (#marketingManager) { "MM" };
      case (#teamLeader) { "TL" };
      case (#bizDev) { "BD" };
    };
    let newId = rolePrefix # "-" # memberIdCounter.toText();

    let newMember : Member = {
      id = newId;
      name = member.name;
      role = member.role;
      email = member.email;
      phone = member.phone;
      address = null;
      photoUrl = member.photoUrl;
      parentId = member.parentId;
      createdAt = Time.now();
      designation = member.designation;
      joiningDate = member.joiningDate;
    };

    members.add(newId, newMember);
    newId;
  };

  public shared ({ caller }) func updateMember(input : UpdateMemberInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update members");
    };
    switch (members.get(input.id)) {
      case (null) { Runtime.trap("Member not found") };
      case (?existing) {
        let updatedMember = {
          id = existing.id;
          name = input.name;
          role = existing.role;
          email = input.email;
          phone = input.phone;
          address = input.address;
          photoUrl = input.photoUrl;
          parentId = existing.parentId;
          createdAt = existing.createdAt;
          designation = input.designation;
          joiningDate = input.joiningDate;
        };
        members.add(input.id, updatedMember);
      };
    };
  };

  public query ({ caller }) func getFullHierarchy() : async [Member] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view hierarchy");
    };
    let membersArray = members.values().toArray();
    membersArray.sort(MemberArray.compareByRoleAndName);
  };

  public query ({ caller }) func getMember(id : Text) : async Member {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view members");
    };
    switch (members.get(id)) {
      case (null) { Runtime.trap("Member not found") };
      case (?m) { m };
    };
  };

  public query ({ caller }) func getChildren(parentId : Text) : async [Member] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view hierarchy");
    };
    members.values().filter(func(m : Member) : Bool { m.parentId == ?parentId }).toArray();
  };

  public shared ({ caller }) func submitInquiry(inquiry : Inquiry) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #guest))) {
      Runtime.trap("Unauthorized: Authentication required to submit inquiries");
    };
    inquiryIdCounter += 1;
    let newId = "INQ-" # inquiryIdCounter.toText();
    let newInquiry : Inquiry = {
      id = newId;
      name = inquiry.name;
      email = inquiry.email;
      phone = inquiry.phone;
      inquiryType = inquiry.inquiryType;
      amount = inquiry.amount;
      message = inquiry.message;
      createdAt = Time.now();
      status = #pending;
    };
    inquiries.add(newId, newInquiry);
    newId;
  };

  public shared ({ caller }) func updateInquiryStatus(id : Text, status : InquiryStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update inquiry status");
    };
    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inq) {
        let updatedInquiry = {
          id = inq.id;
          name = inq.name;
          email = inq.email;
          phone = inq.phone;
          inquiryType = inq.inquiryType;
          amount = inq.amount;
          message = inq.message;
          createdAt = inq.createdAt;
          status = status;
        };
        inquiries.add(id, updatedInquiry);
      };
    };
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries");
    };
    inquiries.values().toArray().sort();
  };

  public query ({ caller }) func getInquiriesByStatus(status : InquiryStatus) : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter inquiries");
    };
    inquiries.values().filter(func(i : Inquiry) : Bool { i.status == status }).toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Salary functions (admin-only)

  public shared ({ caller }) func setSalary(input : SalaryInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can set salaries");
    };
    switch (members.get(input.memberId)) {
      case (null) { Runtime.trap("Member not found") };
      case (?member) {
        let key = input.memberId # "/" # input.year.toText() # "/" # input.month.toText();
        let salaryRecord : SalaryRecord = {
          id = key;
          memberId = input.memberId;
          memberName = member.name;
          memberRole = member.role;
          amount = input.amount;
          month = input.month;
          year = input.year;
          notes = input.notes;
          distributedAt = Time.now();
        };
        salaryRecords.add(key, salaryRecord);
        key;
      };
    };
  };

  public shared ({ caller }) func distributeSalaries(input : SalaryDistributionInput) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can distribute salaries");
    };
    let resultsList = List.empty<Text>();
    for (entry in input.entries.values()) {
      switch (members.get(entry.memberId)) {
        case (null) { Runtime.trap("Member not found") };
        case (?member) {
          let key = entry.memberId # "/" # input.year.toText() # "/" # input.month.toText();
          let salaryRecord : SalaryRecord = {
            id = key;
            memberId = entry.memberId;
            memberName = member.name;
            memberRole = member.role;
            amount = entry.amount;
            month = input.month;
            year = input.year;
            notes = entry.notes;
            distributedAt = Time.now();
          };
          salaryRecords.add(key, salaryRecord);
          resultsList.add(key);
        };
      };
    };
    resultsList.toArray();
  };

  public query ({ caller }) func getSalaryRecords(memberId : Text) : async [SalaryRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can view salary records");
    };
    salaryRecords.values().filter(func(r) { r.memberId == memberId }).toArray();
  };

  public query ({ caller }) func getAllSalaryRecords() : async [SalaryRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can view salary records");
    };
    salaryRecords.values().toArray().sort(SalaryRecordArray.compareByDistributedAt);
  };

  public query ({ caller }) func getSalaryByMonthYear(month : Nat, year : Nat) : async [SalaryRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can view salary records");
    };
    salaryRecords.values().filter(func(r) { r.month == month and r.year == year }).toArray().sort(SalaryRecordArray.compareByAmount);
  };
};

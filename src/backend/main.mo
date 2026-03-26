import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

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

  type CompanyInfo = {
    companyName : Text;
    tagline : Text;
    about : Text;
    mission : Text;
    vision : Text;
    address : Text;
    phone1 : Text;
    phone2 : Text;
    email : Text;
    established : ?Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type Property = {
    id : Text;
    title : Text;
    description : Text;
    price : Text;
    location : Text;
    propertyType : Text;
    status : Text;
    area : ?Text;
    bedrooms : ?Nat;
    imageUrl : ?Text;
    createdAt : Time.Time;
  };

  type Service = {
    id : Text;
    title : Text;
    description : Text;
    features : [Text];
    iconName : Text;
    order : Nat;
  };

  type AdminAccount = {
    username : Text;
    password : Text;
  };

  // State
  let members = Map.empty<Text, Member>();
  let inquiries = Map.empty<Text, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var memberIdCounter = 0;
  var inquiryIdCounter = 0;
  var propertyIdCounter = 0;
  var initialized = false;
  var companyInfo : ?CompanyInfo = null;

  // Salary state
  let salaryRecords = Map.empty<Text, SalaryRecord>();
  let properties = Map.empty<Text, Property>();
  let services = Map.empty<Text, Service>();
  let admins = Map.empty<Text, AdminAccount>();

  // Initialize access control and mixin (kept for compatibility)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to verify admin credentials
  func verifyAdmin(username : Text, password : Text) : Bool {
    switch (admins.get(username)) {
      case (null) { false };
      case (?admin) { admin.password == password };
    };
  };

  // Helper function to require admin authentication
  func requireAdmin(username : Text, password : Text) {
    if (not verifyAdmin(username, password)) {
      Runtime.trap("Unauthorized: Invalid admin credentials");
    };
  };

  // Initialize default data
  public shared func initialize() : async () {
    if (initialized) { return };
    
    // Seed default admin
    admins.add(
      "praneeth",
      {
        username = "praneeth";
        password = "bollevula55";
      },
    );

    // Seed MD
    let mdId = "MD-1";
    let md : Member = {
      id = mdId;
      name = "B Narayana Reddy";
      role = #managingDirector;
      email = "reddynarayana11@gmail.com";
      phone = "9951597247";
      address = null;
      photoUrl = null;
      parentId = null;
      createdAt = Time.now();
      designation = ?"Managing Director";
      joiningDate = null;
    };
    members.add(mdId, md);
    memberIdCounter := 1;

    // Seed default services
    services.add(
      "investment-pooling",
      {
        id = "investment-pooling";
        title = "Investment Pooling";
        description = "Join forces to invest in lucrative real estate projects, shares, and other assets.";
        features = [
          "High ROI",
          "Diversified Portfolio",
          "Professional Management",
        ];
        iconName = "cash-manage";
        order = 1;
      },
    );
    services.add(
      "portfolio-management",
      {
        id = "portfolio-management";
        title = "Portfolio Management";
        description = "Expert curation and management of your investments in shares, bonds, and properties.";
        features = [
          "Risk Assessment",
          "Performance Tracking",
          "Optimization Strategies",
        ];
        iconName = "portfolio";
        order = 2;
      },
    );
    services.add(
      "property-loans",
      {
        id = "property-loans";
        title = "Property-Secured Loans";
        description = "Quick and hassle-free loans against your property assets and gold.";
        features = [
          "Low Interest Rates",
          "Flexible Repayment",
          "Fast Approvals",
        ];
        iconName = "loan";
        order = 3;
      },
    );

    // Seed default company info
    companyInfo := ?{
      companyName = "Maithreya Investors and Developers";
      tagline = "Your Trusted Partner in Finance and Real Estate";
      about = "Leading finance and real estate company";
      mission = "To provide exceptional investment opportunities";
      vision = "To be the most trusted name in finance and real estate";
      address = "Hyderabad, India";
      phone1 = "9951597247";
      phone2 = "";
      email = "reddynarayana11@gmail.com";
      established = ?"2020";
    };

    initialized := true;
  };

  // Helper functions for hierarchy validation
  func countChildrenByRole(parentId : Text, role : Role) : Nat {
    var count = 0;
    for ((_, member) in members.entries()) {
      if (member.parentId == ?parentId and member.role == role) {
        count += 1;
      };
    };
    count;
  };

  // Admin account management functions
  public query func verifyAdminLogin(username : Text, password : Text) : async Bool {
    verifyAdmin(username, password);
  };

  public shared func addAdmin(callerUsername : Text, callerPassword : Text, newUsername : Text, newPassword : Text) : async () {
    requireAdmin(callerUsername, callerPassword);
    
    if (admins.get(newUsername) != null) {
      Runtime.trap("Admin username already exists");
    };

    admins.add(
      newUsername,
      {
        username = newUsername;
        password = newPassword;
      },
    );
  };

  public shared func changeAdminPassword(username : Text, oldPassword : Text, newPassword : Text) : async () {
    switch (admins.get(username)) {
      case (null) { Runtime.trap("Admin not found") };
      case (?admin) {
        if (admin.password != oldPassword) {
          Runtime.trap("Old password is incorrect");
        };
        let updatedAdmin : AdminAccount = {
          username = admin.username;
          password = newPassword;
        };
        admins.add(username, updatedAdmin);
      };
    };
  };

  public shared func removeAdmin(callerUsername : Text, callerPassword : Text, targetUsername : Text) : async () {
    requireAdmin(callerUsername, callerPassword);

    // Count total admins
    var adminCount = 0;
    for ((_, _) in admins.entries()) {
      adminCount += 1;
    };

    if (adminCount <= 1) {
      Runtime.trap("Cannot remove the last admin");
    };

    if (admins.get(targetUsername) == null) {
      Runtime.trap("Target admin not found");
    };

    admins.remove(targetUsername);
  };

  public query func listAdmins(callerUsername : Text, callerPassword : Text) : async [Text] {
    if (not verifyAdmin(callerUsername, callerPassword)) {
      Runtime.trap("Unauthorized: Invalid admin credentials");
    };

    let adminsList = List.empty<Text>();
    for ((username, _) in admins.entries()) {
      adminsList.add(username);
    };
    adminsList.toArray();
  };

  // Property management functions
  public shared func addProperty(callerUsername : Text, callerPassword : Text, property : Property) : async Text {
    requireAdmin(callerUsername, callerPassword);

    propertyIdCounter += 1;
    let newId = "PROP-" # propertyIdCounter.toText();

    let newProperty : Property = {
      id = newId;
      title = property.title;
      description = property.description;
      price = property.price;
      location = property.location;
      propertyType = property.propertyType;
      status = property.status;
      area = property.area;
      bedrooms = property.bedrooms;
      imageUrl = property.imageUrl;
      createdAt = Time.now();
    };

    properties.add(newId, newProperty);
    newId;
  };

  public shared func updateProperty(callerUsername : Text, callerPassword : Text, property : Property) : async () {
    requireAdmin(callerUsername, callerPassword);

    if (properties.get(property.id) == null) {
      Runtime.trap("Property not found");
    };

    properties.add(property.id, property);
  };

  public shared func deleteProperty(callerUsername : Text, callerPassword : Text, id : Text) : async () {
    requireAdmin(callerUsername, callerPassword);

    if (properties.get(id) == null) {
      Runtime.trap("Property not found");
    };

    properties.remove(id);
  };

  public query func getAllProperties() : async [Property] {
    properties.values().toArray();
  };

  // Services management functions
  public shared func updateServices(callerUsername : Text, callerPassword : Text, newServices : [Service]) : async () {
    requireAdmin(callerUsername, callerPassword);

    // Clear existing services
    for ((id, _) in services.entries()) {
      services.remove(id);
    };

    // Add new services
    for (service in newServices.values()) {
      services.add(service.id, service);
    };
  };

  public query func getAllServices() : async [Service] {
    let servicesList = List.empty<Service>();
    for ((_, svc) in services.entries()) {
      servicesList.add(svc);
    };

    let servicesArray = servicesList.toArray();
    servicesArray.sort(func(a : Service, b : Service) : Order.Order {
      Nat.compare(a.order, b.order);
    });
  };

  // Member hierarchy functions (admin-only)
  public shared func createMember(callerUsername : Text, callerPassword : Text, member : Member) : async Text {
    requireAdmin(callerUsername, callerPassword);

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

  public shared func updateMember(callerUsername : Text, callerPassword : Text, input : UpdateMemberInput) : async () {
    requireAdmin(callerUsername, callerPassword);

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

  public query func getFullHierarchy() : async [Member] {
    let membersArray = members.values().toArray();
    membersArray.sort(MemberArray.compareByRoleAndName);
  };

  public query func getMember(id : Text) : async ?Member {
    members.get(id);
  };

  public query func getChildren(parentId : Text) : async [Member] {
    members.values().filter(func(m : Member) : Bool { m.parentId == ?parentId }).toArray();
  };

  // Inquiry functions
  public shared func submitInquiry(inquiry : Inquiry) : async Text {
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

  public shared func updateInquiryStatus(callerUsername : Text, callerPassword : Text, id : Text, status : InquiryStatus) : async () {
    requireAdmin(callerUsername, callerPassword);

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

  public query func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray().sort(func(i1 : Inquiry, i2 : Inquiry) : Order.Order { Text.compare(i1.id, i2.id) });
  };

  public query func getInquiriesByStatus(status : InquiryStatus) : async [Inquiry] {
    inquiries.values().filter(func(i : Inquiry) : Bool { i.status == status }).toArray();
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // Salary functions (admin-only)
  public shared func setSalary(callerUsername : Text, callerPassword : Text, input : SalaryInput) : async Text {
    requireAdmin(callerUsername, callerPassword);

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

  public shared func distributeSalaries(callerUsername : Text, callerPassword : Text, input : SalaryDistributionInput) : async [Text] {
    requireAdmin(callerUsername, callerPassword);

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

  public query func getSalaryRecords(memberId : Text) : async [SalaryRecord] {
    salaryRecords.values().filter(func(r : SalaryRecord) : Bool { r.memberId == memberId }).toArray();
  };

  public query func getAllSalaryRecords() : async [SalaryRecord] {
    salaryRecords.values().toArray().sort(SalaryRecordArray.compareByDistributedAt);
  };

  public query func getSalaryByMonthYear(month : Nat, year : Nat) : async [SalaryRecord] {
    salaryRecords.values().filter(func(r : SalaryRecord) : Bool { r.month == month and r.year == year })
      .toArray().sort(SalaryRecordArray.compareByAmount);
  };

  // Company info functions
  public query func getCompanyInfo() : async ?CompanyInfo {
    companyInfo;
  };

  public shared func updateCompanyInfo(callerUsername : Text, callerPassword : Text, info : CompanyInfo) : async () {
    requireAdmin(callerUsername, callerPassword);
    companyInfo := ?info;
  };
};

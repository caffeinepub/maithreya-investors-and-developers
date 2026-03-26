# Maithreya Investors and Developers

## Current State
The admin panel at `/admin` has two tabs: Members and Inquiries. Only authenticated admins (Internet Identity) can access it. The Member type has: id, name, role, email, phone, address, photoUrl, parentId, createdAt. There is no salary tracking feature.

## Requested Changes (Diff)

### Add
- `SalaryRecord` type: id, memberId, memberName, memberRole, amount (Nat), month (Nat), year (Nat), notes (optional Text), distributedAt (Time)
- `setSalary(memberId, amount, month, year, notes)` — admin-only, creates or updates salary record for a member for a given month/year
- `distributeSalaries(entries: [{memberId, amount, notes}], month, year)` — admin-only, bulk salary distribution to multiple members at once
- `getSalaryRecords(memberId)` — admin-only, returns all salary records for a specific member
- `getAllSalaryRecords()` — admin-only, returns all salary records across all members
- `getSalaryByMonthYear(month, year)` — admin-only, returns salary records for a specific month/year
- A "Salary" tab in the Admin panel (only visible to admin/MD)
  - Shows all members in a table with fields: Name, Role, Salary Amount input, Notes input
  - Month/Year picker at top
  - "Distribute All" button to bulk-save salaries for all members for that month
  - Can also set salary per individual member
  - History tab within Salary section showing past salary distributions grouped by month/year

### Modify
- Admin page: add third tab "Salary Distribution" using existing tab structure

### Remove
- Nothing removed

## Implementation Plan
1. Add SalaryRecord type and salary storage map to main.mo
2. Add setSalary, distributeSalaries, getSalaryRecords, getAllSalaryRecords, getSalaryByMonthYear backend functions (all admin-only)
3. Regenerate backend.d.ts bindings
4. Add useQueries hooks for salary functions
5. Add SalaryDistribution tab to Admin.tsx with:
   - Month/Year selector
   - Table of all members with salary amount + notes inputs
   - "Distribute All" button
   - Salary history viewer

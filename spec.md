# Maithreya Investors and Developers

## Current State
- Multi-page website with Header, Hero, Services (hardcoded 3 cards), About, MLMTree, Contact, Footer
- Admin panel at /admin with Members, Inquiries, Salary Distribution, Company Info tabs
- Admin credentials hardcoded in frontend (praneeth/bollevula55) — no backend auth
- No Properties section on website or in admin
- Services are static/hardcoded in Services.tsx
- No admin account management (add admins, change password)

## Requested Changes (Diff)

### Add
- **Properties section** on the homepage: displays property listings (title, price, location, type, status, description, area, bedrooms)
- **Properties tab** in admin panel: add, edit, delete property listings
- **Services management tab** in admin panel: edit existing service cards (title, description, features, icon)
- **Admin Settings tab** in admin panel:
  - Change password for current logged-in admin
  - Add a new admin account (username + password)
  - View/delete existing admins
- **Backend admin account system**: store admins in Motoko, verify credentials against backend on login (remove hardcoded frontend credentials)
- **Backend Property CRUD**: addProperty, updateProperty, deleteProperty, getAllProperties
- **Backend Service CRUD**: updateServices, getAllServices (seeded with 3 defaults on initialize)

### Modify
- Admin login flow: verify credentials via backend `verifyAdminLogin(username, password)` instead of hardcoded constants
- Services.tsx: fetch services from backend instead of static array; fall back to defaults if none set
- Home.tsx: add `<Properties />` section between Services and About

### Remove
- Hardcoded `ADMIN_NAME` and `ADMIN_PASSWORD` constants in Admin.tsx

## Implementation Plan
1. Update Motoko backend:
   - Add AdminAccount type and map (username -> hashed simple password)
   - Seed default admin (praneeth/bollevula55) in initialize()
   - Add verifyAdminLogin, addAdmin, changePassword, removeAdmin
   - Add Property type and CRUD (addProperty, updateProperty, deleteProperty, getAllProperties)
   - Add Service type and CRUD (updateServices, getAllServices) with default seed
2. Update backend.d.ts with new types and methods
3. Update useQueries.ts with new hooks: useVerifyAdmin, useAddAdmin, useChangePassword, useProperties, useAddProperty, useUpdateProperty, useDeleteProperty, useServices, useUpdateServices
4. Add Properties.tsx component for homepage display
5. Add Properties tab to Admin.tsx with add/edit/delete UI
6. Add Services tab to Admin.tsx to edit service cards
7. Add Admin Settings tab to Admin.tsx for password change and admin management
8. Update Admin.tsx login to call backend verifyAdminLogin
9. Update Services.tsx to load from backend with fallback to defaults
10. Update Home.tsx to include Properties section

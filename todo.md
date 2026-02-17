# MCC Kansas City Dashboard - TODO

## Current Issues to Fix
- [x] Fix Export to Excel functionality (now downloads file automatically)
- [x] Create branded MCC login page - Sign Out redirects to MCC-branded login page
- [x] Remove "System Status" indicator and replace with Sign Out

## Features Completed
- [x] Live dashboard with KPI cards and charts
- [x] 12-month Gantt visualization
- [x] Smartsheet API integration (placeholder)
- [x] Admin panel with user/role management
- [x] RBAC system with institution-level access
- [x] Dynamic role management APIs
- [x] Professional MCC branding throughout
- [x] Excel/PDF export APIs (backend)
- [x] Database schema and migrations
- [x] Seeding script for default roles

## Current Work - Initiatives & Sub-boxes Functionality
- [x] Update database schema for initiatives and sub-boxes with CRUD support
- [x] Create tRPC procedures for initiatives and sub-boxes (add, edit, delete, get)
- [x] Redesign UI with 3D borders instead of background colors
- [x] Remove colorful backgrounds and apply subtle lucent effects
- [x] Create interactive sub-box editing modal
- [x] Add status field to sub-boxes (Not Started, In Progress, Complete, At Risk)
- [x] Add notes field to sub-boxes
- [ ] Add document upload functionality to sub-boxes
- [x] Implement goal filtering on dashboard
- [ ] Add CRUD buttons (Add Initiative, Edit, Delete) to UI
- [x] Make sub-boxes clickable to open edit modal
- [x] Test all CRUD operations
- [x] Test goal filtering
- [ ] Test document upload

## UI/UX Improvements - Tab Navigation & CRUD
- [x] Replace dropdown filter with Goal tabs (A, B, C, D, All)
- [x] Fix sub-box adding bug (users cannot add subcategories)
- [x] Add "Add Initiative" button for each goal tab
- [x] Add delete initiative functionality with confirmation
- [x] Test tab navigation and switching between goals
- [x] Test adding new initiatives from UI
- [x] Test deleting initiatives
- [x] Test sub-box creation after bug fix

## UI Refinements
- [x] Add subtle background shade/styling to Sign Out button for better visibility

## Bug Fixes
- [x] Fixed missing key prop error in InitiativesSection GOAL_TABS.map()

## Full Goal Names & App Integration
- [x] Update Goals dropdown to show full goal names (not just A, B, C, D)
- [x] Update tab labels in InitiativesSection to show full goal names
- [x] Ensure Goals filter in top section connects to InitiativesSection
- [x] Verify all data flows are connected between components
- [x] Test full integration across all dashboard sections

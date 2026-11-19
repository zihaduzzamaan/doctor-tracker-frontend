# Project Requirements: Doctor Tracker

This document defines the functional and non-functional requirements for the **Doctor Tracker** web application. All requirements are based on the project specification and organized in clear tables for easy tracking and verification.

---

# 1. Functional Requirements (FR)

### 1.1 Authentication & Access Control (FR-1)

| Requirement ID | Feature | Description | Acceptance Criteria / Technical Details | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **FR-1.1** | Admin Login | Allow clinic administrators to sign in securely. | Form requires valid email and password. Returns a secure JWT upon successful credentials check. | **High** |
| **FR-1.2** | Route Protection | Block unauthenticated access to the application. | All dashboard, doctor, and patient routes redirect to `/login` if no valid token exists. | **High** |
| **FR-1.3** | Session Handling | Maintain user login state across page reloads. | Tokens stored securely in HttpOnly cookies or client auth state with automatic expiration checks. | **High** |
| **FR-1.4** | Logout | Provide a clean logout mechanism. | Clears the session token and redirects the user immediately to the login view. | **Medium** |

### 1.2 Doctor Management (FR-2)

| Requirement ID | Feature | Description | Acceptance Criteria / Technical Details | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **FR-2.1** | Create Doctor | Add a new doctor profile to the clinic system. | Form validates required fields: Name, Specialization (e.g. Cardiology), Hospital, Phone, and unique Email. | **High** |
| **FR-2.2** | Doctor List View | Display all doctors in a clear table/grid format. | Shows name, specialty, hospital, contact information, and assigned patient count. | **High** |
| **FR-2.3** | Real-Time Search | Search doctors by typing keywords. | Debounced text search matching doctor name, specialization, hospital, or email without full page reloads. | **High** |
| **FR-2.4** | Multi-Attribute Filter | Filter doctors by specific criteria. | Filter by medical specialization, hospital clinic, and creation date ranges. Supports resetting all filters. | **High** |
| **FR-2.5** | Paginated Records | Break large doctor lists into manageable pages. | Server-side pagination with configurable page size (default: 10 per page) and previous/next controls. | **High** |
| **FR-2.6** | View Assigned Patients | Inspect patients assigned to a specific doctor. | Clicking a doctor opens a list or slide-out drawer showing their current patients. | **High** |
| **FR-2.7** | Assign Patient | Link a new or existing patient to a doctor. | Associates patient record with doctor's ID and increments doctor's patient counter atomically. | **Medium** |
| **FR-2.8** | Remove Patient from Doctor | Unlink a patient from a doctor's care list. | Disassociates patient from doctor with a confirmation step; decrements doctor's patient counter atomically. | **Medium** |

### 1.3 Patient Management (FR-3)

| Requirement ID | Feature | Description | Acceptance Criteria / Technical Details | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **FR-3.1** | Dedicated Patient Page | Standalone page listing all patients in the system. | Displays patient table with name, age, contact, medical condition, assigned doctor, and admission date. | **High** |
| **FR-3.2** | Patient Search | Quickly locate any patient record. | Instant search matching patient name, phone number, or medical condition. | **High** |
| **FR-3.3** | Patient Filtering | Filter patients by condition and dates. | Filter dropdowns for medical condition, current status (Admitted, Stable, Critical, Discharged), and date. | **High** |
| **FR-3.4** | Edit Patient | Update patient information. | Modal form allowing updates to patient contact, condition, status, and assigned doctor. | **High** |
| **FR-3.5** | Delete Patient | Remove a patient record from the database. | Shows a confirmation modal before deletion. Safely removes patient and updates doctor counters. | **Medium** |
| **FR-3.6** | Patient Pagination | Paginate the global patient registry. | Server-side indexed pagination preventing performance loss as patient numbers grow. | **High** |

### 1.4 Dashboard & Visual Analytics (FR-4)

| Requirement ID | Feature | Description | Acceptance Criteria / Technical Details | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **FR-4.1** | KPI Summary Cards | High-level practice metric cards. | Displays: 1) Total Doctors, 2) Total Patients, 3) Average Patients per Doctor, 4) Weekly Admissions. | **High** |
| **FR-4.2** | Specialty Chart | Visual chart of patients by medical specialty. | Donut or bar chart aggregating patient counts grouped by doctor specialization. | **High** |
| **FR-4.3** | Admission Trends Chart | Date-based timeline chart. | Line or area chart displaying patient admissions over time (daily / weekly / monthly). | **High** |
| **FR-4.4** | Query Performance | Dashboard data must load fast. | Single-pass MongoDB aggregation pipeline; loads in under 200ms without blocking UI. | **High** |

---

# 2. Non-Functional Requirements (NFR)

### 2.1 Performance & Optimization (NFR-1)

| Requirement ID | Area | Target Standard | Verification Method | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **NFR-1.1** | Database Latency | Database queries must execute in < 50ms. | Verify with MongoDB `explain("executionStats")` to confirm index scans (`IXSCAN`) and zero collection scans (`COLLSCAN`). | **High** |
| **NFR-1.2** | API Response Time | REST API endpoints must respond in < 150ms. | Automated API latency test on paginated endpoints. | **High** |
| **NFR-1.3** | Core Web Vitals | LCP <= 2.5s, INP <= 200ms, CLS <= 0.1. | Measured via Chrome DevTools / Lighthouse audit on client build. | **High** |
| **NFR-1.4** | Efficient Rendering | Avoid unnecessary React re-renders. | Component memoization, debounced search inputs (300ms), and isolated state. | **Medium** |

### 2.2 Security & Data Protection (NFR-2)

| Requirement ID | Area | Target Standard | Verification Method | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **NFR-2.1** | Input Validation | Validate 100% of incoming data on the server. | Strict Zod schemas on all POST/PUT/query payloads. | **High** |
| **NFR-2.2** | Injection Prevention | NoSQL query injection prevention. | Sanitization via `express-mongo-sanitize` middleware; parameterized Mongoose queries. | **High** |
| **NFR-2.3** | Security Headers | Enforce HTTP security headers. | Use Helmet middleware and restrict CORS to the client URL. | **High** |
| **NFR-2.4** | Rate Limiting | Protect auth and search endpoints from abuse. | Apply `express-rate-limit` (e.g. max 5 login attempts per 15 min per IP). | **High** |
| **NFR-2.5** | Secret Management | Zero secrets stored in source control. | All keys, tokens, and database URIs loaded strictly from `.env` files. | **High** |

### 2.3 UI/UX & Accessibility (NFR-3)

| Requirement ID | Area | Target Standard | Verification Method | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **NFR-3.1** | Accessibility | Target WCAG 2.2 Level AA compliance. | Automated axe-core / Lighthouse audit with score >= 95. | **High** |
| **NFR-3.2** | Color Contrast | Text-to-background contrast ratio >= 4.5:1. | Verified against accessible clinical teal & slate design tokens. | **High** |
| **NFR-3.3** | Keyboard Navigation | All forms, tables, modals operable via keyboard. | Tab key traversal, visible focus rings, and Escape key modal dismiss. | **High** |
| **NFR-3.4** | 5 View States | Every interactive view supports 5 explicit states. | Loading (skeletons), Empty (friendly CTA), Error (retry), Success, Disabled. | **High** |
| **NFR-3.5** | Responsiveness | Seamless on mobile (< 640px), tablet, and desktop. | Tested across multiple viewport breakpoints without horizontal scrolling. | **High** |

### 2.4 Technology Stack & Architecture (NFR-4)

| Component | Selected Technology | Requirement / Constraint |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router, React 19, TypeScript)** | Separate client application; clean folder layout; reusable components. |
| **Backend** | **Node.js & Express (TypeScript)** | Standalone server; 4-layer architecture (Routes, Controllers, Services, Models). |
| **Database** | **MongoDB (6.0+), Mongoose ODM** | Proper indexing (compound and text search indexes); efficient query patterns. |
| **API Protocol** | **RESTful JSON API (`/api/v1`)** | Standard HTTP status codes (200, 201, 400, 401, 404, 500) and uniform response wrapper. |

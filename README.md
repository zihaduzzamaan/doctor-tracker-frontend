# Doctor Tracker: Frontend Client Application

# Overview
This directory contains the decoupled frontend client for Doctor Tracker, built with Next.js 15, React 19, Tailwind CSS, and TanStack Query.

---

# Architecture

```text
client/
├── public/                 # Static visual assets, brand icons, illustrations
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (auth)/         # Authentication route group (/login)
│   │   ├── (dashboard)/    # Authenticated administrative workspace group
│   │   │   ├── page.tsx    # Dashboard & Visual Analytics (/)
│   │   │   ├── doctors/    # Doctor management workspace (/doctors)
│   │   │   └── patients/   # Dedicated patient management workspace (/patients)
│   │   ├── layout.tsx      # Root layout (Navigation, Header, Context Providers)
│   │   └── globals.css     # Global styles & design tokens
│   ├── components/
│   │   ├── ui/             # Accessible atomic UI components (Button, Modal, Input, Badge, Table)
│   │   ├── layout/         # Sidebar, Navbar, MobileMenu
│   │   ├── doctors/        # DoctorCard, DoctorTable, DoctorFilterBar, DoctorPatientDrawer
│   │   ├── patients/       # PatientTable, PatientFilterBar, PatientEditModal
│   │   └── analytics/      # MetricCard, AdmissionTrendsChart, SpecialtyDonutChart
│   ├── hooks/              # Custom React hooks (useAuth, useDebounce, useMediaQuery)
│   ├── lib/                # API client (Axios/Fetch wrapper), formatting utilities
│   ├── services/           # Typed client-side API query/mutation hooks
│   └── types/              # Shared TypeScript definitions (Doctor, Patient, User)
├── .env.example            # Template for client environment variables
├── next.config.ts          # Next.js build and proxy configuration
├── tailwind.config.ts      # Design token mappings (Teal, Slate, Status tokens)
├── tsconfig.json           # Strict TypeScript configuration
└── package.json            # Client dependencies and scripts
```

---

# Environment Configuration

See `.env.example`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

# 🏕️ YESCA TEAM — Youth Camp Management System

**YESCA Team** (Youth Evangelistic Soldiers of Christian Assemblies) is a youth ministry organizing annual **YESCA Youth Camps** across Andhra Pradesh and Telangana.

This system is the **centralized platform** for managing registrations, payments, members, admin dashboards, and multi-year camp data.

---

## 🌿 Project Overview

YESCA conducts large-scale youth camps every January with **800–1000 attendees**.

The system manages:

- Year-wise registrations
- Online + on-site front-desk management
- Payments (PhonePe integration)
- ID generation & linking
- Admin dashboards
- Announcements, devotionals, games, and feedback

The system evolves every year — YC25 (2025) was built on Firebase with an unstructured database.

Starting with **YC26 (2026)**, a **new clean architecture** and central database (`yesca_main`) has been introduced.

---

## 🧠 Purpose of the System

> To build a unified, scalable, and organized system for YESCA Team that can manage all camps under a single Firebase project.
> 

---

## 🏗️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | **Next.js 15 (App Router)** + **Tailwind CSS** + **ShadCN/UI** |
| Backend | **Firebase (Firestore, Auth, Storage, Cloud Functions)** |
| Hosting | Vercel |
| Authentication | Firebase Email & Password (Admin access only, for now) |
| Future Auth | Phone OTP Auth |
| Database | Firestore (NoSQL) |
| Payments | PhonePe payment Gateway  |
| Storage | Firebase Storage (for photos, ID cards, etc.) |
| Version Control | GitHub |
| AI Assistance | GitHub Copilot Agent (this README is its context) |

---

## 🗄️ Database Architecture (Firestore)

```
yesca_main
├── members
│   └── Yesca0001
│        ├── full_name
│        ├── dob
│        ├── phone_number
│        ├── gender
│        ├── church_name
│        ├── address
│        ├── believer - bool
│        ├── fathername
│        ├── marriage_status
│        ├── baptism_date
│        ├── faith_box_supporter - bool
│        ├── registered_camps
│        ├── education
│        ├── occupation
│        ├── future_goals
│        ├── current_skills
│        ├── desired_skills
│        ├── last_registered_camp
│        ├── created_at
│        └── updated_at
│
├── camps
│   ├── YC25
│   │    ├── registrations
│   │    ├── payments
│   │    ├── announcements
│   │    ├── devotionals
│   │    └── games
│   ├── YC26
│   │    ├── registrations
│   │    ├── payments
│   │    ├── announcements
│   │    ├── devotionals
│   │    └── games
│   └── YC27
│        └── ...
│
├── roles
├── settings
└── audit_logs

```

---

## 🧩 Detailed Schema Overview

### 🔹 1. Members

Permanent profile of each person who ever attended a YESCA camp.

| Field | Type | Description |
| --- | --- | --- |
| full_name | string | Attendee’s full name |
| dob | date | Date of birth |
| phone_number | string | Primary phone number (shared among family if needed) |
| gender | string | M / F |
| church_name | string | Local church name |
| address | string | City or village address |
| believer | boolean | Indicates if the person is a believer |
| fathername | string | Father's name |
| marriage_status | string | Marital status (e.g., single, married) |
| baptism_date | date | Date of baptism |
| faith_box_supporter | boolean | Indicates if they are a faith box supporter (discounted registration) |
| registered_camps | array | List of camps attended (e.g., ["YC25", "YC26"]) |
| education | string | Educational background |
| occupation | string | Current occupation |
| future_goals | string | Future aspirations or goals |
| current_skills | string | Current skills possessed |
| desired_skills | string | Skills they wish to acquire |
| last_registered_camp | string | Latest camp attended |
| created_at | timestamp | Record creation timestamp |
| updated_at | timestamp | Last update timestamp |

---

### 🔹 2. Camps

Each camp (YC25, YC26, etc.) stores year-specific data.

### `/camps/{camp_id}`

| Field | Type | Description |
| --- | --- | --- |
| camp_id | string | YC26 |
| title | string | "YESCA Youth Camp 2026" |
| theme | string | "Freedom – Truth and Freedom" |
| verse | string | "John 8:32" |
| year | number | 2026 |
| location | string | Andhra Pradesh |
| start_date / end_date | date | Camp duration |
| status | string | upcoming / completed |
| color_theme | object | primary + secondary hex values |

---

### `/camps/{camp_id}/registrations/{id}`

| Field | Type | Description |
| --- | --- | --- |
| registration_id | string | YC26-0001 |
| full_name | string | Attendee name |
| dob | date | DOB |
| phone_number | string | Phone |
| address | string | Address |
| registration_type | string | normal / child / faith_box |
| payment_status | string | paid / pending |
| linked | boolean | true if linked to member |
| linked_member_id | string | MEM-xxxx |
| verified_by | string | Admin who linked |
| verified_at | timestamp | Date of linking |
| camp_id_number | number | ID assigned at camp |
| attended | boolean | true if attended |
| registered_at | timestamp | Date of registration |

---

### `/camps/{camp_id}/payments/{id}`

Stores payment records for online or offline transactions.

### `/camps/{camp_id}/announcements`

Used for push notifications and in-app updates.

### `/camps/{camp_id}/devotionals`

Stores daily devotionals / blog posts.

### `/camps/{camp_id}/games`

Future module for scores and team activities.

---

### 🔹 3. Roles

| Field | Type | Description |
| --- | --- | --- |
| name | string | Admin name |
| email | string | Login email |
| role | string | super_admin / admin / front_desk |
| permissions | array | List of allowed actions |
| assigned_by | string | Super admin name |
| assigned_on | timestamp | Date of role assignment |

---

### 🔹 4. Settings

- `/settings/system` — global flags
- `/settings/counters` — numeric counters for ID generation

| Key | Example |
| --- | --- |
| current_camp | YC26 |
| registration_open | true |
| member_counter | 1056 |
| registration_counter_YC26 | 642 |

---

### 🔹 5. Audit Logs

Track all admin actions (who linked, edited, or deleted).

| Field | Description |
| --- | --- |
| action | e.g. "link_member" |
| admin | Name or email |
| target_id | Document affected |
| old_value / new_value | Optional snapshots |
| timestamp | Action time |

---

## 🔐 Authentication Plan

### Current Stage (Phase 1)

- Firebase **Email/Password Auth** for admins only
- Super Admin created manually in Firebase Console

### Future Plan (Phase 2)

- Custom **Phone OTP Auth** for attendees - whatsapp auth
- Only existing numbers in `/members` can login
- Multi-member “Switch Account” system for shared numbers

---

## 🧰 Admin Roles

| Role | Permissions |
| --- | --- |
| Super Admin | Full access, create admins/front desk |
| Admin | Manage registrations, verify members, payments |
| Front Desk | Register attendees, search members, view linked data |
| User | View profile, registration history, games |

---

## 🚀 Development Roadmap

| Phase | Features | Status |
| --- | --- | --- |
| **Phase 1** | New Firebase project setup, clean Firestore schema, YC25 import under `/camps/YC25` | ✅ In progress |
| **Phase 2** | Admin login (Email/Password), Dashboard UI, Verify & Add to Members feature | ⏳ Next |
| **Phase 3** | Payment system (PhonePe), Announcements, Devotionals | 🔜 |
| **Phase 4** | Games module & Leaderboards | 🕹️ Planned |
| **Phase 5** | Attendee Auth (Phone OTP + multi-profile login) | 📱 Future |

---

## 💻 Project Setup (Local Development)

```bash
# 1️⃣ Clone repository
git clone https://github.com/yourusername/yesca-team.git
cd yesca-team

# 2️⃣ Install dependencies
pnpm install

# 3️⃣ Create .env.local file
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yesca-main
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# 4️⃣ Run local dev server
pnpm dev

```

---

## 📂 Project Folder Structure

```
src/
 ├── app/                 # Next.js App Router
 │   ├── admin/           # Dashboard pages
 │   ├── frontdesk/       # Front desk registration UI
 │   ├── camps/           # Camp-specific routes
 │   ├── api/             # Server actions / Firebase Cloud Functions
 │   └── page.tsx
 ├── components/          # UI Components
 ├── lib/                 # Firebase config, utilities
 ├── contexts/            # Auth + Role context
 ├── styles/              # Tailwind + custom CSS
 └── types/               # Type definitions

```

---

## ⚙️ Core Functional Flow

1️⃣ User registers online (stored in `/camps/{camp}/registrations`)

2️⃣ Admin verifies → adds to `/members` (auto-link)

3️⃣ Front Desk assigns camp ID during check-in

4️⃣ Admins manage payments, devotionals, and announcements

5️⃣ Future: attendees login → access dashboard & games

---

## 🧩 Integration Plan for AI Agents (Copilot / GPT)

Copilot Agent context includes:

- This README
- Firebase schema + collections
- Feature roadmap (Verify & Add, Admin Login, Payments, etc.)
- Tech Stack: **Next.js 14 + Tailwind + Firebase SDK**
- Focus on implementing feature-by-feature from roadmap.

---

## ✝️ About YESCA

**Youth Evangelistic Soldiers of Christian Assemblies (YESCA)**

Dedicated to building spiritually strong youth through the Word of God,

fellowship, and service — empowering the next generation for Kingdom impact.

---

**Author:** YESCA Team Development Group

**Developer:** Sandesh Apparala

**Year:** 2025–2026
# ✈️ SAIN International Logistics - Enterprise Freight & Consignment Tracking Suite

<div align="center">

![SAIN International Logistics Banner](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80)

**An enterprise-grade cross-border freight forwarding, real-time cargo tracking, and logistics operations platform.**  
Connecting Guangzhou/Global Air-Sea Terminals directly to Bangladesh Doorstep delivery.

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.15-red?logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[Features](#-key-features) •
[Architecture](#-system-architecture) •
[Tech Stack](#-tech-stack) •
[Data Flow](#-real-time-synchronization-workflow) •
[API Reference](#-rest-api-reference) •
[Quick Start](#-installation--setup) •
[License](#-license)

</div>

---

## 📌 Executive Overview

**SAIN International Logistics** is a modern, full-stack logistics management platform architected for international freight forwarders, cargo consolidators, and supply chain operators.

It bridges the operational gap between origin cargo warehouses (e.g. Guangzhou Baiyun Terminal [CAN]) and destination clearance hubs (e.g. Hazrat Shahjalal International Airport Customs House [DAC]), offering real-time visibility, automated waybill generation, regulatory compliance under the **Bangladesh Customs Act 2023**, and an administrative management suite.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 + TypeScript)"]
        UI_User["Public User Tracking View<br/>(Hero Experience / Modal)"]
        UI_Admin["Admin Operations Portal<br/>(ShipmentManager / CMS Editors)"]
        UI_Waybill["Printable Waybill & Barcode Engine<br/>(WaybillPrintModal)"]
    end

    subgraph StateLayer ["Frontend State & Sync Layer"]
        CTX["TrackingContext<br/>(Single Source of Truth)"]
        EVENT_BUS["Window CustomEvent Bus<br/>(sain_consignment_updated)"]
        LOCAL_CACHE["LocalStorage Storage Fallback<br/>(sain_logistics_consignments_data)"]
    end

    subgraph API ["REST API Layer (Django REST Framework)"]
        ROUTER["API Router & Endpoints<br/>(/api/v1/couriers/)"]
        TRACK_EP["/track/{consignment_no}/<br/>(Public Realtime Query)"]
        CRUD_EP["/consignments/{consignment_no}/update_full/<br/>(Admin Full Update & Sync)"]
        AUTH_EP["Authentication & Permission Gates"]
    end

    subgraph BackendCore ["Django Core & Business Logic"]
        MODEL_CSG["Consignment Model<br/>(Cargo Specs, Customs, Parties)"]
        MODEL_MLS["Milestone Timeline Model<br/>(Checkpoints & History)"]
        MODEL_PKG["Package Specification Model<br/>(Cartons, Crates, Pallets, Loose)"]
        SERIALIZER["DRF Nested Serializers<br/>(Full JSON Bidirectional Mapping)"]
    end

    subgraph Persistence ["Database Layer"]
        DB[(PostgreSQL / SQLite<br/>Neon / Supabase / Local)]
    end

    UI_User -->|Search by AWB / Bill No.| CTX
    UI_Admin -->|+Add New Bill / Edit / Publish| CTX
    CTX <-->|Real-time Event Broadcast| EVENT_BUS
    CTX <-->|Offline Caching & State Hydration| LOCAL_CACHE
    CTX <===>|HTTP / JSON REST API| ROUTER
    ROUTER --> TRACK_EP
    ROUTER --> CRUD_EP
    ROUTER --> AUTH_EP
    TRACK_EP --> SERIALIZER
    CRUD_EP --> SERIALIZER
    SERIALIZER <--> MODEL_CSG
    SERIALIZER <--> MODEL_MLS
    SERIALIZER <--> MODEL_PKG
    MODEL_CSG <--> DB
    MODEL_MLS <--> DB
    MODEL_PKG <--> DB
    UI_Admin -.-> UI_Waybill
```

---

## ⚡ Key Features

### 1. 🔍 Live Consignment Tracking Engine & Lifecycle Progression
- **Unified Consignment Lookup**: Instant query by Consignment Code, Reference Number, or Air Waybill number (`SAINEX067638406`, `SAINEX74389960`, `12345`, `SAIN-78492-BD`, `SAIN-SEA-99120`).
- **Transit Corridor Visualization**: Visual progress connecting Origin Hubs (e.g. `[CAN] Guangzhou, China`) to Destination Hubs (e.g. `[DAC] Dhaka, Bangladesh`).
- **Dynamic Milestone Timeline with Prerequisite Synthesis**:
  - Automatically ensures all preceding lifecycle stages (`Pending` → `Received` → `In Transit`) are displayed sequentially when a shipment advances to `At Bangladesh warehouse` or beyond.
  - Generates realistic, chronologically ordered audit timestamps and geographic tags so customer tracking always displays a complete 3+ step journey.
- **Cargo Specification Breakdown**: Detailed display of Gross Weight, Carton Count, Volume (CBM), Payment Mode, HS Codes, and Dimensions.
- **Statutory Customs Compliance**: Live assessment badge under the **Bangladesh Customs Act 2023**, trade terms (DAP/CFR), and assessment stations.

### 2. 🛠️ Enterprise Admin Operations Portal (`/admin` / `/sain-sakib`)
- **Full Consignment Lifecycle Management**: Add, modify, publish, archive, or trash consignments with live central database persistence.
- **`+ Add New Bill` Generator**: Generates an auto-incremented, collision-checked unique consignment code starting with **`SAINEX` + 8 digits** (e.g., `SAINEX58291402`), resetting all fields to a clean state ready for entry.
- **Recycle Bin (Trash) & Instant Deletion Confirmation**:
  - **Move to Trash**: Safely relocates any consignment into the Recycle Bin with confirmation.
  - **Restore / Recycle**: Instant single-click restoration of any trashed bill back to active tracking.
  - **Delete Permanently**: Modal dialog (`ConfirmModal`) mounted directly inside the Trash view with immediate popup ("Yes, Delete Permanently" & "Cancel"), executing atomic purge across local cache and central database.
  - **Empty Recycle Bin**: Bulk deletion action to purge all trashed consignments simultaneously.
- **10-Checkpoint Milestone Pagination**: Shipment history checkpoints table paginated to **10 records per page** with interactive `[Prev] [1] [2] ... [Next]` navigation controls.
- **Standardized Package Piece Types**:
  - `-- Select Type --`
  - `Pallet`
  - `Carton`
  - `Crate`
  - `Loose`
  - `Others`
- **10 Authorized Consignment Statuses**:
  | Status | Color Badge | Meaning |
  | :--- | :--- | :--- |
  | `Pending` | Indigo / Purple | Consignment booked, pending terminal handover |
  | `Received` | Indigo / Purple | Received at origin hub terminal |
  | `On Hold by Customs` | Orange Pulse | Inspection hold at customs house |
  | `Out for delivery` | Amber Pulse | Dispatched on last-mile delivery vehicle |
  | `In Transit` | Blue | Moving across international corridor |
  | `En Route` | Blue | In flight or ocean voyage underway |
  | `Cancelled` | Red / Rose | Booking terminated |
  | `Delivered` | Emerald Green | Successfully delivered to consignee |
  | `Returned` | Red / Rose | Returned to hub or shipper |
  | `At Bangladesh warehouse` | Teal / Cyan | Staged at local Dhaka warehouse |

### 3. ⏰ Bangladesh Standard Time (BST UTC+6) & Time Formatting
- **Native BST Persistence**: Configured Django with `USE_TZ = False` to store raw Bangladesh Standard Time directly in MySQL `DATETIME` columns, eliminating 6-hour timestamp discrepancies.
- **Clean 12-Hour Time Format**: Integrated `formatToBDTime()` helper ensuring consistent 12-hour timestamps (e.g., `01:46 PM`, `08:30 PM`) across admin inputs, milestones, and customer tracking views.

### 4. 🖨️ Real-Time Dynamic Air Waybill (AWB) Generator
- **Live Form Synchronization**: `WaybillPrintModal` dynamically mirrors all current form inputs (shipper, consignee, package breakdown, total freight, CRN, notes) in real time without requiring prior saving.
- **Official IATA Layout**: Conforms to standard International Air Waybill layout with Code 128 barcode simulation, carrier stamps, signature zones, and billing itemization.
- **Print Optimization**: High-fidelity `@media print` CSS stripping browser headers and footers for clean physical label and invoice printing.

### 5. 🔄 Central Database Multi-Device Sync & Unicode Sanitization
- **Multi-Device & Cross-Browser Synchronization**: Full bidirectional synchronization between Django REST backend (hosted on cPanel MySQL) and React clients.
- **Unicode Currency Sanitization**: Automated conversion of Bengali Taka currency symbols (`৳` / `\u09F3`) to `BDT` across both frontend context and backend DRF serializers/views, eliminating MySQL `1366 Incorrect string value` errors.
- **Connection Encoding**: Configured MySQL connection with `SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci` for safe multilingual text storage.
- **Dual-Tier Resilient Caching**: Background `LocalStorage` cache fallback with optimistic UI rendering.
- **Real-Time Event Broadcast**: `window.dispatchEvent(new CustomEvent('sain_consignment_updated'))` updates all open tabs and views instantly.

---

## 💻 Tech Stack

### Frontend Architecture
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.0.1` | Declarative UI component architecture |
| **TypeScript** | `5.x / 7.x` | Strict end-to-end type safety |
| **Tailwind CSS** | `v4.3.3` | Modern utility-first responsive styling system |
| **Vite** | `8.3.0` | Ultra-fast build tool and Hot Module Replacement |
| **Lucide React** | `^0.546.0` | Enterprise iconography suite |
| **Motion** | `^12.23.24` | Smooth transitions and state animations |

### Backend Architecture
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Python** | `3.12+` | Runtime environment |
| **Django** | `5.x` | Enterprise web framework |
| **Django REST Framework** | `3.15+` | High-throughput REST API serializer and views |
| **django-cors-headers** | `4.3.1` | Cross-Origin Resource Sharing handling for dev & prod |
| **dj-database-url** | `2.1.0` | 12-factor cloud database URL configuration |
| **SQLite / PostgreSQL** | `3 / 15+` | Relational data persistence with foreign-key cascade integrity |

---

## 📡 REST API Reference

Base URL: `http://127.0.0.1:8000/api/v1/couriers/`

### 1. Public Tracking Endpoint
```http
GET /api/v1/couriers/track/{consignment_no}/
```
- **Description**: Public endpoint returning complete milestone history, carrier details, package counts, and customs status.
- **Response**: `200 OK`
```json
{
  "consignment_no": "SAINEX067638406",
  "reference_no": "CRN-884920",
  "status": "At Bangladesh warehouse",
  "service_type": "Air Freight Priority",
  "carrier": "SAINEX",
  "origin_city": "Guangzhou",
  "origin_code": "CAN",
  "destination_city": "Dhaka",
  "destination_code": "DAC",
  "receiver_name": "Muhammad Tahin",
  "receiver_phone": "+8801731939325",
  "packages_count": "7",
  "weight_text": "around 1500g",
  "progress_percentage": 75,
  "milestones": [
    {
      "id": 1,
      "date_str": "2026-08-01",
      "time_str": "19:47 pm",
      "location": "China",
      "status": "Received",
      "remarks": "Terminal check-in completed"
    },
    {
      "id": 2,
      "date_str": "2026-08-11",
      "time_str": "13:46 pm",
      "location": "Bangladesh",
      "status": "At Bangladesh warehouse",
      "remarks": "Inward gate entry completed"
    }
  ]
}
```

### 2. List All Consignments
```http
GET /api/v1/couriers/consignments/
```
- **Description**: Returns all registered active shipments.

### 3. Full Consignment Update
```http
PUT /api/v1/couriers/consignments/{consignment_no}/update_full/
```
- **Description**: Atomically updates consignment metadata, replaces packages, and inserts sequential milestone timeline entries.
- **Body**: JSON payload with `status`, `packages_data`, `milestones`, `receiver`, and `admin_metadata`.

---

## 📂 Directory Structure

```text
sain-international-logistics/
├── Backend/                            # Django Backend Application
│   ├── api/                            # API router configuration
│   ├── core/                           # Core utilities & base models
│   ├── couriers/                       # Logistics Engine (Consignments, Milestones, Packages)
│   │   ├── migrations/                 # Schema migrations
│   │   ├── models.py                   # Consignment & Milestone models
│   │   ├── serializers.py              # DRF serializers
│   │   ├── views.py                    # REST views & tracking endpoints
│   │   └── urls.py                     # App routing
│   ├── order/                          # Commercial orders & billing
│   ├── products/                       # Cargo product classifications
│   ├── users/                          # User accounts & admin authentication
│   ├── sain/                           # Django project root (settings.py, urls.py, wsgi.py)
│   ├── db.sqlite3                      # Local relational database
│   ├── manage.py                       # Django CLI tool
│   └── requirements.txt                # Python dependencies
│
├── Frontend/                           # React 19 + TypeScript Application
│   ├── Context/
│   │   └── TrackingContext.tsx         # Central state manager & real-time sync
│   ├── Layouts/
│   │   └── MainLayout.tsx              # Public site frame & modal mounting
│   ├── components/
│   │   ├── admin/                      # Enterprise Admin Portal Components
│   │   │   ├── AboutContentEditor.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminProfileEditor.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── ContactContentEditor.tsx
│   │   │   ├── HomeContentEditor.tsx
│   │   │   ├── ServicesContentEditor.tsx
│   │   │   ├── ShipmentManager.tsx     # Consignment management workstation
│   │   │   └── WaybillPrintModal.tsx   # Printable AWB & Invoice layout
│   │   ├── HeroTrackingExperience.tsx  # Dynamic hero search widget
│   │   ├── Navbar.tsx                  # Public header with admin portal link
│   │   ├── ServicesSection.tsx         # Logistics services catalog
│   │   ├── TrackingModal.tsx           # Fullscreen interactive tracking modal
│   │   └── TrackingSection.tsx         # Standalone tracking card
│   ├── pages/
│   │   ├── AdminPage.tsx               # Admin authentication & shell controller
│   │   ├── HomePage.tsx                # Public landing page
│   │   └── ServicesPage.tsx            # Dedicated services breakdown
│   ├── services/
│   │   └── trackingData.ts             # Initial consignments, types & status helpers
│   ├── App.tsx                         # Client router & tab navigation
│   └── index.css                       # Tailwind CSS rules & print styles
│
├── package.json                        # Frontend dependencies & npm scripts
└── README.md                           # Master architectural documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: `v18.x` or higher
- **Python**: `v3.10` or higher
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/SayhamKayes/SKz-Logistics.git
cd SKz-Logistics
```

---

### Step 2: Backend Setup (Django)
```bash
# Navigate to Backend folder
cd Backend

# Create and activate Python virtual environment
python -m venv venv
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# (Optional) Create superuser
python manage.py createsuperuser

# Start the Django API server
python manage.py runserver 8000
```
> The API will be active at `http://127.0.0.1:8000/api/v1/couriers/`

---

### Step 3: Frontend Setup (React + Vite)
In a new terminal window:
```bash
# From repository root
npm install

# Start the Vite development server
npm run dev
```
> The web application will launch at `http://localhost:3000`

---

## 🔑 Default Credentials & Quick Test Data

### Admin Portal Credentials
- **URL**: Navigate to the top navbar and click **Admin Portal** or append `admin` view.
- **Username**: `sain_sakib6055`
- **Password**: `password123`

### Sample Tracking Numbers for Testing
| Tracking Code | Type | Corridor | Packages |
| :--- | :--- | :--- | :--- |
| **`SAINEX067638406`** | Priority Air Freight | Guangzhou (CAN) → Dhaka (DAC) | 7 Cartons |
| **`12345`** | Express Courier | Guangzhou Hub → Dhaka Doorstep | 1 Box |
| **`SAIN-78492-BD`** | Commercial Freight | China → Bangladesh | 5 Crates |
| **`SAIN-SEA-99120`** | Ocean FCL Vessel | Ningbo Port → Chittagong Port | 2 Pallets |

---

## 📜 Bangladesh Customs Act 2023 Compliance

The platform includes built-in compliance tracking with the **Bangladesh Customs Act 2023**:
- **Statutory Framework**: Formulated according to National Board of Revenue (NBR) digital customs guidelines.
- **Incoterms Support**: Full documentation for `DAP` (Delivered at Place), `CFR` (Cost & Freight), and `FOB` (Free on Board).
- **Customs Stations**: Pre-linked with Hazrat Shahjalal International Airport (HSIA), Chittagong Sea Port, and Kamalapur ICD.

---

## 📦 cPanel Production Deployment Guide

The repository includes an automated packaging pipeline producing 100% Linux/Unix-compatible ZIP archives with forward slashes for direct cPanel deployment.

### 1. Build Production Packages
Run the automated build script from the project root:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\build_deploy_zip.ps1
```
This builds the optimized React distribution and generates two clean deployment archives in `deploy_cpanel/`:
- **`public_html_frontend.zip`**: Contains the compiled Vite SPA, static assets, and `.htaccess` for Apache rewrite routing.
- **`sain_backend.zip`**: Contains the Django REST backend configured with `passenger_wsgi.py` and MySQL database connection.

### 2. Upload to cPanel Server
1. **Frontend Deployment**:
   - In cPanel File Manager, upload `public_html_frontend.zip` to `/home/saininte/public_html/`.
   - Extract files directly into `public_html/`.
2. **Backend Deployment**:
   - Upload `sain_backend.zip` to `/home/saininte/sain_backend/`.
   - Extract files into `sain_backend/`.
   - Navigate to cPanel **Setup Python App**, select the application, and click **Restart Application**.

---

## 📄 License

This project is open-sourced under the [MIT License](./LICENSE).

```text
MIT License
Copyright (c) 2026 Sayham Kayes
```

You are permitted to freely use, modify, distribute, and integrate this software in commercial and personal applications. For full terms, please refer directly to the [LICENSE](./LICENSE) document.

---

## 👨‍💻 Author & Engineering Credits

- **Lead Engineer & Architect**: **[Sayham Kayes](https://github.com/SayhamKayes)**
- **Organization**: SKzLAB
- **Repository**: [SayhamKayes/SKz-Logistics](https://github.com/SayhamKayes/SKz-Logistics.git)

---

<div align="center">
  <sub>Built with ❤️ for high-performance international air & ocean freight forwarding.</sub>
</div>

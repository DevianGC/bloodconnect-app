# 🩸 BloodConnect Olongapo

**Centralized blood donor communication and alert system for Olongapo City**

A Next.js-based frontend application designed to connect blood donors, hospitals, and the City Health Office to coordinate urgent blood donation needs.

## 📋 Project Overview

**Name:** BloodConnect Olongapo  
**Tagline:** Centralized blood donor communication and alert system  
**Tech Stack:**
- **Frontend:** Next.js 15 (React + App Router)
- **Styling:** Pure CSS (CSS Modules)
- **Backend (Future):** Node.js + Express + MongoDB (planned integration)

**Purpose:**  
BloodConnect Olongapo connects blood donors, hospitals, and the City Health Office to coordinate urgent donation needs. The system allows admins to manage blood requests and donors, while donors can register, update profiles, and receive emergency alerts.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bloodconnectolongapo
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 System Roles

### 1. Admin Role
**Purpose:** Manage donor data, handle emergency blood requests, and monitor analytics.

**Admin Pages:**
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Overview with stats and active requests
- `/admin/requests` - Create blood requests and auto-match donors
- `/admin/donors` - Manage donor database (CRUD operations)
- `/admin/analytics` - View donor statistics and trends
- `/admin/settings` - Admin profile and system settings

**Demo Credentials:**
- Email: `admin@bloodconnect.com`
- Password: `admin123`

### 2. Donor Role
**Purpose:** Register, manage info, and respond to emergency alerts.

**Donor Pages:**
- `/donor/register` - New donor registration
- `/donor/login` - Donor authentication
- `/donor/profile` - View donor information and eligibility
- `/donor/update` - Edit contact details and preferences
- `/donor/alerts` - View emergency blood request notifications

**Demo Credentials:**
- Email: `juan.delacruz@email.com`
- Password: `donor123`

## 📁 Project Structure

```
/bloodconnectolongapo
├── /app
│   ├── layout.js              # Root layout
│   ├── page.js                # Landing page
│   ├── globals.css            # Global styles
│   ├── /admin
│   │   ├── login/page.js
│   │   ├── dashboard/page.js
│   │   ├── requests/page.js
│   │   ├── donors/page.js
│   │   ├── analytics/page.js
│   │   └── settings/page.js
│   └── /donor
│       ├── register/page.js
│       ├── login/page.js
│       ├── profile/page.js
│       ├── update/page.js
│       └── alerts/page.js
├── /components
│   ├── Navbar.js              # Navigation bar
│   ├── Sidebar.js             # Admin/Donor sidebar
│   ├── DonorCard.js           # Donor information card
│   ├── RequestForm.js         # Blood request form
│   ├── AnalyticsChart.js      # Chart components
│   ├── Modal.js               # Modal dialog
│   └── Footer.js              # Footer component
├── /lib
│   ├── api.js                 # API utility functions (mock)
│   └── mockData.js            # Mock data for development
├── /styles
│   ├── components.module.css  # Component styles
│   ├── landing.module.css     # Landing page styles
│   ├── admin.module.css       # Admin pages styles
│   ├── auth.module.css        # Authentication styles
│   └── donor.module.css       # Donor pages styles
├── package.json
└── README.md
```

## 🎨 Features

### Landing Page
- Hero section with call-to-action
- How it works (4-step process)
- Impact statistics
- Blood types showcase
- Eligibility requirements
- Privacy information

### Admin Features
- **Dashboard:** Summary cards, active requests, blood type distribution
- **Blood Requests:** Create requests, auto-match donors, send bulk alerts
- **Donor Management:** Add/edit/deactivate donors, filter by blood type/barangay
- **Analytics:** Charts showing donor distribution by blood type and location
- **Settings:** Profile management, system preferences

### Donor Features
- **Registration:** Complete signup with blood type, location, preferences
- **Profile:** View eligibility status, personal information, donation guidelines
- **Update Info:** Edit contact details, address, alert preferences
- **Alerts:** View emergency blood requests matching blood type

## 🔧 Backend Integration (Future)

The frontend is structured to easily integrate with a REST API backend. All API calls are centralized in `/lib/api.js` with the following planned endpoints:

### Authentication
- `POST /api/admin/login`
- `POST /api/donors/login`
- `POST /api/donors/register`
- `POST /api/logout`

### Donors
- `GET /api/donors` - List all donors (with filters)
- `GET /api/donors/:id` - Get donor by ID
- `POST /api/donors` - Create new donor
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Deactivate donor

### Blood Requests
- `GET /api/requests` - List all requests
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `POST /api/requests/:id/fulfill` - Mark as fulfilled

### Alerts
- `GET /api/alerts` - Get alerts (filtered by donor)
- `POST /api/alerts/bulk` - Send bulk alerts to donors

### Analytics
- `GET /api/analytics` - Get system analytics

## 📊 Mock Data

The application currently uses mock data from `/lib/mockData.js`:
- 8 sample donors with various blood types
- 3 sample blood requests
- 3 sample alerts
- Analytics data (donor counts by blood type and barangay)

## 🎯 Key Technologies

- **Next.js 15:** React framework with App Router
- **React 19:** Latest React features
- **Pure CSS:** No external CSS frameworks
- **CSS Modules:** Scoped component styling
- **Client Components:** Interactive UI with `'use client'`
- **localStorage:** Temporary authentication state (to be replaced with proper auth)

## 🔒 Data Privacy

BloodConnect Olongapo is designed to comply with the **Data Privacy Act of 2012 (Republic Act No. 10173)**:
- All donor information is encrypted and stored securely
- Data is only used for emergency blood donation coordination
- Never shared with third parties
- Donors can opt out of alerts anytime

## 🚧 Development Notes

### Current State
- ✅ Complete frontend UI/UX
- ✅ All pages and components
- ✅ Mock data and API placeholders
- ✅ Responsive design
- ⏳ Backend integration (pending)
- ⏳ Real authentication (pending)
- ⏳ Email notification system (pending)

### To Replace with Backend
1. Replace `localStorage` authentication with JWT/sessions
2. Connect all API functions in `/lib/api.js` to real endpoints
3. Implement email notification service
4. Add database integration (MongoDB)
5. Implement file upload for donor documents
6. Add real-time notifications

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🤝 Contributing

This project is ready for backend integration. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed for Olongapo City Health Office.

## 📞 Support

For questions or support:
- **Email:** health@olongapo.gov.ph
- **Emergency Hotline:** 911
- **City Health Office:** (047) 222-XXXX

---

**Built with ❤️ for the people of Olongapo City**

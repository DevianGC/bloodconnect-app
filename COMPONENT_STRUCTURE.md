# Component Structure

## Overview
All components have been restructured into individual folders with their own CSS modules for better organization and maintainability.

## New Structure

```
/components
├── /AnalyticsChart
│   ├── AnalyticsChart.js
│   └── AnalyticsChart.module.css
├── /DonorCard
│   ├── DonorCard.js
│   └── DonorCard.module.css
├── /Footer
│   ├── Footer.js
│   └── Footer.module.css
├── /Modal
│   ├── Modal.js
│   └── Modal.module.css
├── /Navbar
│   ├── Navbar.js
│   └── Navbar.module.css
├── /RequestForm
│   ├── RequestForm.js
│   └── RequestForm.module.css
└── /Sidebar
    ├── Sidebar.js
    └── Sidebar.module.css
```

## Import Statements

### Before (Old Structure)
```javascript
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
```

### After (New Structure)
```javascript
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Modal from '../components/Modal/Modal';
```

## Benefits

1. **Better Organization**: Each component has its own folder containing both JS and CSS files
2. **Easier Maintenance**: Changes to a component are isolated to its folder
3. **Clearer Dependencies**: CSS is co-located with the component it styles
4. **Scalability**: Easy to add more files per component (tests, stories, etc.)
5. **No Global CSS Conflicts**: Each component has its own scoped CSS module

## Removed Files

- ❌ `/components/*.js` (old flat structure files)
- ❌ `/styles/components.module.css` (consolidated component styles)

## Remaining Global Styles

The following CSS files remain in `/styles` as they are page-specific:
- `admin.module.css` - Admin pages styling
- `auth.module.css` - Authentication pages styling
- `donor.module.css` - Donor pages styling
- `landing.module.css` - Landing page styling

## Updated Pages

All pages have been updated with the new import paths:
- ✅ Landing page (`/app/page.js`)
- ✅ Admin pages (`/app/admin/*`)
- ✅ Donor pages (`/app/donor/*`)

## Testing

To verify the restructuring works correctly:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test all routes:
   - `/` - Landing page
   - `/admin/login` - Admin login
   - `/admin/dashboard` - Admin dashboard
   - `/donor/register` - Donor registration
   - `/donor/login` - Donor login
   - `/donor/profile` - Donor profile

3. Verify all components render correctly with their styles

## Notes

- All CSS variables from `globals.css` are still available to component CSS modules
- Component CSS modules use the same design system (colors, spacing, etc.)
- No functionality has been changed, only file organization

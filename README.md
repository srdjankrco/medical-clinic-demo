# Medical Clinic Management System - Demo Prototype

A clickable React prototype showcasing core features of the Medical Clinic Management System for client demonstrations.

## Features

- 🏥 Patient Registration & Management
- 📅 Appointment Scheduling
- 📝 Clinical Documentation (SOAP Notes)
- 📊 Dashboard & Analytics
- 👤 Patient Portal
- 🌍 India & Qatar Compliance Modules

## Tech Stack

- **React 18** with TypeScript
- **Ant Design** for UI components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Vite** for build tooling
- **Recharts** for data visualization

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page-level components
├── layouts/          # Layout templates
├── data/             # Mock data and fixtures
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
├── assets/           # Images, icons, etc.
└── App.tsx           # Main application component
```

## Mock Data

This prototype uses mock data generated with Faker.js for demonstration purposes. No backend connection is required.

## Deployment

The prototype is configured for deployment to Azure Static Web Apps. See [demo-prototype-plan.md](../.kiro/specs/medical-clinic-management-system/demo-prototype-plan.md) for deployment instructions.

## Demo Scenarios

1. **Patient Registration**: Complete workflow from registration to patient profile
2. **Appointment Booking**: Schedule appointments with calendar interface
3. **Clinical Documentation**: Create SOAP notes with templates
4. **Patient Portal**: Patient-facing features and self-service
5. **Compliance**: India and Qatar regulatory tracking

## Known Limitations

This is a demo prototype with the following limitations:

- Mock data only (no real database)
- No authentication (demo mode)
- Limited mobile optimization (in progress)
- Some features are visual mockups only

## Next Steps

After client feedback, this prototype will evolve into the production application by:

1. Connecting to real backend APIs
2. Implementing authentication and authorization
3. Adding data persistence
4. Comprehensive testing
5. Performance optimization

## License

Proprietary - Medical Clinic Management System

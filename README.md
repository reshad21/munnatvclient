# Hilful Fujool - Tours & Travel Client

A modern, feature-rich travel and tourism management platform built with Next.js, TypeScript, and Tailwind CSS. This application provides a seamless experience for managing hajj packages, services, galleries, blogs, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Design Reference](#design-reference)
- [Contributing](#contributing)
- [License](#license)

## Features

✨ **Core Features:**
- 🛫 **Hajj & Umrah Packages**: Browse and manage comprehensive travel packages
- 🏢 **Services Management**: Complete service offerings display
- 🖼️ **Gallery**: Photo and video galleries with rich media support
- 📰 **Blog System**: Publish and manage travel blogs and articles
- 📞 **Contact Management**: Integrated contact forms and inquiries
- 👨‍💼 **Dashboard**: Admin dashboard for content management
- 🔐 **Authentication**: Secure user authentication and authorization
- 📱 **Responsive Design**: Fully responsive across all device sizes
- 🌙 **Dark Mode**: Theme switching capability
- 💬 **Rich Text Editor**: Advanced content creation with WYSIWYG editor

## Tech Stack

### Frontend
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Shadcn/ui + Radix UI
- **Form Management**: React Hook Form
- **HTTP Client**: Axios
- **Rich Text**: TipTap Editor
- **Icons**: Lucide React
- **Date Handling**: Date-fns
- **Validation**: Zod

### Development
- **Linting**: ESLint
- **Component Library**: Shadcn/ui
- **Package Manager**: npm/yarn

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── _components/
│   ├── (common)/                 # Public pages
│   │   ├── layout.tsx
│   │   ├── _components/
│   │   ├── about-us/
│   │   ├── blogs/
│   │   ├── contact-us/
│   │   ├── gallery/
│   │   ├── hajj-packages/
│   │   ├── services/
│   │   └── video-gallery/
│   ├── (dashboard)/              # Dashboard section
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   └── _components/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── shared/                   # Shared UI components
│   │   ├── Dashboard/
│   │   ├── DeleteModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Pagination.tsx
│   │   ├── Preview.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── Spinner.tsx
│   │   ├── menu/
│   │   └── skeletons/
│   └── ui/                       # Shadcn/ui components
├── services/                     # API service modules
│   ├── auth/
│   ├── blog/
│   ├── contacts/
│   ├── gallery/
│   ├── package/
│   ├── role/
│   ├── service/
│   └── video-gallery/
├── hooks/                        # Custom React hooks
│   ├── adminHooks.ts
│   ├── use-mobile.ts
│   └── useMode.ts
├── lib/                          # Utility functions & helpers
│   ├── apiRequest.ts
│   ├── clientFetcher.ts
│   ├── fetchClient.ts
│   ├── serverFetcher.ts
│   ├── getAccessToken.ts
│   ├── getNewAccessToken.ts
│   └── env.ts
├── types/                        # TypeScript type definitions
│   ├── auth.types.ts
│   ├── package.interface.ts
│   └── query.types.ts
├── utils/                        # Utility functions
│   ├── formatDate.ts
│   ├── formatToBengaliDate.tsx
│   ├── sanitizeHtml.ts
│   ├── stripHtmlTags.ts
│   ├── toastMessage.ts
│   └── youtube-utils.ts
├── validations/                  # Validation schemas
│   ├── admin.validation.ts
│   ├── contact.validation.ts
│   └── role.validation.ts
├── constant/                     # Application constants
│   └── dashboardNavbar.constant.ts
├── provider/                     # Context & providers
│   └── Provider.tsx
└── proxy.ts                      # Proxy configuration
```

## Getting Started

### Prerequisites

- **Node.js**: v18.17 or later
- **npm** or **yarn**: Latest version
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/reshad21/munnatvclient.git
   cd Hilful_fujool_client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

### Code Quality

- Follow TypeScript strict mode
- Use ESLint for code consistency
- Use Tailwind CSS for styling
- Maintain component documentation where needed

### Creating Components

#### Shared Component Example
```typescript
// src/components/shared/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

## Building for Production

### Build the Application
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deployment Options
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Supports Next.js with functions
- **Self-hosted**: Use production server command

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=refresh_token

# Features
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## API Integration

The application uses Axios for HTTP requests with interceptors for authentication:

### Making API Calls
```typescript
import { apiRequest } from '@/lib/apiRequest';

// GET request
const data = await apiRequest.get('/packages');

// POST request
const response = await apiRequest.post('/contacts', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

### Authentication Flow
- Tokens stored in localStorage
- Automatic token refresh mechanism
- Interceptors handle 401 responses

## Design Reference

View the project's UI/UX designs in the [Figma file](https://www.figma.com/design/2Ng9uZOj1JaQF232l8AJY5/Hilful-Fujool-Tours---Travels).

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
```

## License

This project is private and proprietary. Unauthorized copying or distribution is prohibited.

---

<div align="center">

**Built with ❤️ by the Development Team**

For issues and questions, please open an issue on GitHub.

</div>
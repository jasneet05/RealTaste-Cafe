# Real Taste - Frontend

Modern React frontend for Real Taste Cafe built with Vite, Tailwind CSS v4, and Redux Toolkit.

## Features

- 🎨 Modern UI with Tailwind CSS v4
- 🔄 State management with Redux Toolkit
- 🛒 Shopping cart functionality
- 🔐 User authentication
- 📱 Responsive design
- ⚡ Fast development with Vite
- 🎯 TypeScript-ready

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   └── ui/              # Reusable components
├── pages/               # Page components
├── store/
│   └── slices/          # Redux slices
├── utils/               # Utility functions
└── App.jsx              # Main app component
```

## API Integration

The frontend connects to the backend server running on `http://localhost:5000`. Make sure your server is running before starting the frontend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
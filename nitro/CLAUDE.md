# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database Commands
- `npm run seed` - Populate database with initial data using Prisma seed script
- `npx prisma migrate dev --name [migration_name]` - Create and apply database migrations
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma studio` - Open Prisma Studio for database GUI

### Testing
- Test files are located in `__tests__` directories within modules
- Uses Jest and React Testing Library
- Example test: `src/modules/account/__tests__/change-password-form.test.tsx`

## Architecture Overview

This is a Next.js 15 application with TypeScript that implements a role-based authentication system using NextAuth.js and Prisma ORM.

### Core Technologies
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **NextAuth.js v4** for authentication
- **Prisma ORM** with PostgreSQL
- **Tailwind CSS** with Radix UI components
- **React Hook Form** with Zod validation

### Authentication & Authorization
- **RBAC System**: Users have roles, roles have permissions
- **Database Models**: User -> UserRole -> Role -> Permission
- **JWT Strategy**: Sessions stored both in JWT tokens and database
- **Middleware Protection**: Routes protected via `src/middleware.ts`
- **Permission Hook**: `usePermissions()` hook for client-side permission checks

### Database Schema (Prisma)
Key models:
- `User` - Core user data with NextAuth compatibility
- `Role` - User roles (admin, user, etc.)
- `Permission` - Granular permissions
- `UserRole` - Many-to-many user-role junction
- `Session`, `Account`, `VerificationToken` - NextAuth required models

### Project Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/ui/` - Reusable UI components (Radix-based)
- `src/modules/` - Feature-based modules with components and tests
- `src/lib/auth/` - Authentication configuration and utilities
- `src/hooks/` - Custom React hooks
- `prisma/` - Database schema and migrations

### Key Files
- `src/lib/auth/auth-options.ts` - NextAuth configuration with custom JWT callbacks
- `src/middleware.ts` - Route protection middleware with role-based access
- `src/hooks/use-permissions.ts` - Client-side permission checking
- `prisma/schema.prisma` - Database schema definition

### Environment Requirements
- Node.js >= 22.0.0
- PostgreSQL database
- Environment variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

### Development Notes
- All API routes requiring authentication should be protected via middleware
- Use `usePermissions()` hook for conditional UI rendering based on user permissions
- Database changes require running `npx prisma migrate dev` and `npx prisma generate`
- Seed database after migrations with `npm run seed`
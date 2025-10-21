# UI CS Complaint System

A Next.js-based complaint management system for the University of Ibadan Computer Science Department.

## Features

- Student registration and authentication
- Admin and student role-based access
- Complaint submission and management
- Modern UI with Tailwind CSS and shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. Get your Supabase credentials:
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Navigate to Settings > API in your Supabase dashboard
   - Copy the Project URL and replace `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the anon/public key and replace `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Important**: Copy the service_role key and replace `SUPABASE_SERVICE_ROLE_KEY` (this is required for the API routes to work)

**Note**: The service_role key is different from the anon key and has elevated permissions. Keep it secure and never expose it in client-side code.

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Setup

The application expects a Supabase database with the following tables:
- `profiles` - User profiles with role-based access
- Additional tables for complaint management (to be implemented)

### API Architecture

The application uses a hybrid approach for data access:

- **Client-side**: Uses Supabase client with anon key for authentication (`signInWithPassword`, `signUp`)
- **Server-side**: Uses service role key via API routes to bypass RLS for profile lookups
- **API Route**: `/api/profiles` - Handles profile lookups by matric number, email, or user ID

This architecture ensures:
- Secure authentication flow
- Proper RLS bypass for server-side operations
- Consistent error handling across the application

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://fonts.google.com/specimen/Inter) font.

## Troubleshooting

### API Routes Returning 500 Errors

If you're getting 500 errors from `/api/profiles`, check:

1. **Service Role Key**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your `.env.local`
2. **Debug Endpoint**: Visit `/api/debug` to check your configuration
3. **Console Logs**: Check your terminal/server logs for detailed error messages

### Common Issues

- **"Service role not configured"**: Missing `SUPABASE_SERVICE_ROLE_KEY` in environment variables
- **"Profile not found"**: User doesn't exist in the profiles table (404 is expected for new users)
- **Database connection errors**: Check your Supabase URL and ensure the project is active

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

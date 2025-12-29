# Environment Variable Setup Guide

## GOOGLE_DRIVE_API_KEY

This environment variable is configured to **NOT** be exposed to the frontend (no `VITE_` prefix).

### Local Development (Vite)

1. Create a `.env.local` file in the root directory of your project:
   ```
   GOOGLE_DRIVE_API_KEY=your_actual_api_key_here
   ```

2. The `.env.local` file is already in `.gitignore` (via `*.local`), so it won't be committed to git.

3. **Important**: Since this variable doesn't have the `VITE_` prefix, it will **NOT** be available in frontend code. It's only available in:
   - Build-time Node.js code
   - Vercel serverless functions/API routes (if you create them)

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `GOOGLE_DRIVE_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Select the environments you want (Production, Preview, Development)
4. Click **Save**

### Usage in Code

Since this variable doesn't have the `VITE_` prefix, you **cannot** access it in frontend React components via `import.meta.env.GOOGLE_DRIVE_API_KEY`.

If you need to use this key, you should:
- Create a Vercel API route (serverless function) in the `/api` directory
- Access it via `process.env.GOOGLE_DRIVE_API_KEY` in the API route
- Have your frontend call the API route instead of using the key directly

Example API route structure:
```
/api/google-drive/route.ts (or .js)
```

### Security Notes

✅ **Secure**: This setup prevents the API key from being exposed to the frontend
⚠️ **Important**: Never add `VITE_` prefix to this variable - that would expose it to all users
✅ **Protected**: The `.env.local` file is git-ignored, so it won't be committed


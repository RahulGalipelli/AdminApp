# Render Deployment Fix for AdminApp

## Issue
Render can't detect the port because Vite's dev server doesn't bind to `0.0.0.0` by default.

## Solution

### Step 1: Update Render Service Settings

1. Go to Render Dashboard → Your AdminApp Web Service
2. Click **"Settings"**
3. Find **"Start Command"**
4. Change from: `npm run dev`
5. To: `npm start`

### Step 2: Verify package.json

Make sure your `package.json` has:
```json
{
  "scripts": {
    "start": "vite preview --host 0.0.0.0"
  }
}
```

This will:
- Serve the built static files (production-ready)
- Bind to `0.0.0.0` (required by Render)
- Use the PORT environment variable automatically

### Step 3: Redeploy

After updating the start command, Render will automatically redeploy.

---

## Why This Works

- `vite preview` serves the built static files (faster, production-ready)
- `--host 0.0.0.0` makes it accessible from outside (required by Render)
- Render automatically sets the `PORT` environment variable
- Vite preview will use the PORT env var automatically

---

## Alternative: If Preview Doesn't Work

If you need to use dev server instead:

1. Update `vite.config.ts`:
```typescript
preview: {
  host: '0.0.0.0',
  port: parseInt(process.env.PORT || '3002'),
}
```

2. Update start command in Render to: `npm start`

But `vite preview` is recommended for production!


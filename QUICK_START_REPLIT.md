# 🚀 Quick Start Guide for Replit

## Step 1: Import Repository
1. Go to [Replit.com](https://replit.com)
2. Click **"Create Repl"**
3. Select **"Import from GitHub"**
4. Paste: `https://github.com/roseyseyewear/MindJourneyFINAL-STRETCH`
5. Click **"Import from GitHub"**

## Step 2: Add Environment Variables (Optional)

Click the **🔒 Secrets** tab and add:

### For Full Functionality:
```
DATABASE_URL=postgresql://your-neon-database-url
KLAVIYO_API_KEY=your-klaviyo-private-key
SESSION_SECRET=any-random-string-here
```

### For Demo/Testing (No setup needed):
The app will work without these - it uses a mock database for development!

## Step 3: Run the Application
Click the big **"Run"** button! 

The startup script will:
- ✅ Install all dependencies
- ✅ Build the application  
- ✅ Start the server
- ✅ Open your Delta Final Stretch lab experience

## Expected Output:
```
Installing dependencies...
Building application...
⚠️  DATABASE_URL not set. Using mock database for development.
💡 Set DATABASE_URL in Replit Secrets to use real database.
serving on port 5000
```

## What You'll See:
1. **Welcome Screen** - "Enter the Lab" button
2. **Hypothesis Page** - Share your hypothesis with video
3. **Chat Interface** - Follow-up questions  
4. **Contact Capture** - Email collection with benefits
5. **Lab Hub** - Completion with room selection

## Environment Setup (Optional)

### Get a Free Database:
1. Sign up at [Neon.tech](https://neon.tech) (free)
2. Create a database
3. Copy connection string to `DATABASE_URL` in Secrets

### Get Email Automation:
1. Sign up at [Klaviyo.com](https://klaviyo.com) (free)
2. Get your Private API Key  
3. Add to `KLAVIYO_API_KEY` in Secrets

## Troubleshooting:

### Build Errors:
- Click **"Stop"** then **"Run"** again
- Check the Console for specific errors

### Still Not Working:
- Open the **Shell** tab
- Run: `npm install && npm run start:dev`

### Database Issues:
- The app works fine without DATABASE_URL (uses mock data)
- For persistent data, add a real database URL

## 🎯 That's It!

Your Delta Final Stretch lab experience should be running and ready to collect visitor hypotheses and emails!

**Total setup time: 2-3 minutes**
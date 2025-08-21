# Running Delta Final Stretch on Replit

## Quick Start

1. **Import from GitHub:**
   - Go to Replit.com
   - Click "Create Repl"
   - Select "Import from GitHub"
   - Enter: `https://github.com/roseyseyewear/MindJourneyFINAL-STRETCH`

2. **If Nix Build Fails:**
   - Delete `.replit` and `replit.nix` files
   - Rename `.replit-simple` to `.replit`
   - This uses a simpler configuration without nix dependencies

3. **Environment Variables:**
   Add these in the Secrets tab (🔒):
   ```
   DATABASE_URL=your_neon_database_url
   KLAVIYO_API_KEY=your_klaviyo_private_key
   KLAVIYO_LIST_ID=your_klaviyo_list_id
   SESSION_SECRET=your_random_session_secret
   ```

4. **Start the Application:**
   - Click the "Run" button
   - Or run: `npm start`

## If You Get Errors

### Error: "Cannot find module" or build issues
```bash
# Run these commands in the Shell tab:
npm install
npm run build
npm start
```

### Error: Database connection issues
1. Sign up for a free Neon database: https://neon.tech
2. Copy the connection string to DATABASE_URL in Secrets
3. Run: `npm run db:push`

### Error: Port issues
- Replit should automatically detect port 5000
- If not, check that .replit file has the correct port configuration

### Error: Video files not loading
- Videos should be in `client/public/videos/`
- Check that the build process copied them to `dist/public/videos/`

## Development Mode

For active development, use:
```bash
npm run dev
```

This runs both the frontend and backend with hot reloading.

## Testing the Lab Experience

1. Once running, you'll see the welcome screen
2. Click "Enter the Lab" to start the hypothesis entry
3. Complete the 4-page flow:
   - Hypothesis entry (with video)
   - Chat response 
   - Contact capture
   - Lab hub

## Expected Behavior

- ✅ Welcome screen loads with "Enter the Lab" button
- ✅ Video plays in lightbox after clicking
- ✅ Chat interface appears with hypothesis prompt
- ✅ Contact form captures email with visitor benefits
- ✅ Lab hub shows completion with room selection
- ✅ Email automation triggers (if Klaviyo configured)

## Troubleshooting

### Videos not playing:
- Check browser console for video loading errors
- Ensure video files are in correct directory
- Try different video format (MP4 works best)

### Email capture not working:
- Verify KLAVIYO_API_KEY in Secrets
- Check KLAVIYO_LIST_ID is correct
- Look for errors in server logs

### Database errors:
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Run `npm run db:push` to create tables
- Check Neon database is active and accessible

### Still having issues?
1. Check the Console tab for error messages
2. Look at the server logs in the Shell
3. Verify all environment variables are set
4. Try rebuilding: `npm run build && npm start`

## Production Deployment

Once working on Replit, you can:
1. Use Replit's built-in deployment
2. Export to other platforms (Vercel, Netlify, etc.)
3. Set up custom domain through Replit

## Architecture Notes

This is a full-stack application with:
- **Frontend**: React + TypeScript (built with Vite)
- **Backend**: Express.js server  
- **Database**: PostgreSQL (via Neon)
- **Email**: Klaviyo integration
- **Videos**: Served statically from public directory

The application runs on a single port (5000) with the Express server serving both API endpoints and static files.
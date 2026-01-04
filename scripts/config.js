/**
 * App Configuration
 * This file contains sensitive API keys - DO NOT commit to Git!
 * Copy config.example.js to config.js and fill in your values.
 */

const CONFIG = {
    // Gemini AI
    GEMINI_API_KEY: 'AIzaSyAC05Uj2GkRt1IsKWIvS-u_8tMDlG8hfI4',
    GEMINI_MODEL: 'gemini-2.5-flash',

    // Supabase
    SUPABASE_URL: 'https://moxfaxmnghqyujcxbvzt.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veGZheG1uZ2hxeXVqY3hidnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNTkxMjAsImV4cCI6MjA3OTYzNTEyMH0.ibpfNqlne4HpcbPNu2dxh6BbWFMV2PtS0yjiM6_Iv1o',

    // Google OAuth (optional - for Calendar/Gmail)
    GOOGLE_CLIENT_ID: '' // Add your Google OAuth Client ID here
};

window.CONFIG = CONFIG;

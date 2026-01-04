/**
 * App Configuration Template
 * Copy this file to config.js and fill in your API keys.
 * 
 * Get your keys from:
 * - Gemini: https://aistudio.google.com/apikey
 * - Supabase: https://supabase.com/dashboard (Project Settings > API)
 * - Google OAuth: https://console.cloud.google.com (APIs & Services > Credentials)
 */

const CONFIG = {
    // Gemini AI
    GEMINI_API_KEY: 'your-gemini-api-key-here',
    GEMINI_MODEL: 'gemini-2.5-flash',

    // Supabase
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',

    // Google OAuth (optional - for Calendar/Gmail)
    GOOGLE_CLIENT_ID: 'your-google-client-id.apps.googleusercontent.com'
};

window.CONFIG = CONFIG;

const fs = require('fs');
const path = require('path');

const configContent = `/**
 * App Configuration
 * Generated automatically from Environment Variables during build
 */
const CONFIG = {
    // Gemini AI
    GEMINI_API_KEY: '${process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''}',
    GEMINI_MODEL: '${process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash-8b'}',

    // Supabase
    SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}',
    SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}',

    // Google OAuth
    GOOGLE_CLIENT_ID: '${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}'
};

window.CONFIG = CONFIG;
console.log('App Configuration Loaded');
`;

const outputPath = path.join(__dirname, 'scripts', 'config.js');

try {
    fs.writeFileSync(outputPath, configContent);
    console.log('✅ Successfully generated scripts/config.js from environment variables');
} catch (error) {
    console.error('❌ Error generating config.js:', error);
    process.exit(1);
}

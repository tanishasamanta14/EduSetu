const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseUrl = process.env.SUPABASE_URL || '';
if (supabaseUrl.includes('supabase.com/dashboard/project/')) {
  const match = supabaseUrl.match(/\/project\/([a-zA-Z0-9_-]+)/);
  if (match) {
    supabaseUrl = `https://${match[1]}.supabase.co`;
  }
}

module.exports = {
  port: process.env.PORT || 3000,
  supabaseUrl: supabaseUrl,
  supabasePublishableKey: publishableKey,
  supabaseAnonKey: publishableKey, // compatibility fallback
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod',
  grokApiKey: process.env.GROK_API_KEY,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};

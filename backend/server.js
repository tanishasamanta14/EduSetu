/* ============================================================
   EduSetu — Main Server Entry Point (Supabase Architecture)
   ============================================================ */

'use strict';

const app = require('./app');
const config = require('./config/env');
const { checkConnection, isRealSupabase } = require('./config/supabase');

async function startServer() {
  const connection = await checkConnection();
  const hasGrok = !!(config.grokApiKey && config.grokApiKey !== 'your-grok-api-key-here');

  const server = app.listen(config.port, '127.0.0.1', () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════════════════╗');
    console.log(`  ║   EduSetu Server running on port ${config.port.toString().padEnd(4)}                ║`);
    console.log(`  ║   http://localhost:${config.port.toString().padEnd(34)}║`);
    console.log('  ╠══════════════════════════════════════════════════════╣');
    
    if (connection && connection.connected && connection.provider === 'cloud') {
      console.log('  ║   ✅ Connected to Cloud Supabase (PostgreSQL + Auth) ║');
    } else {
      console.log('  ║   ⚡ Local Supabase Adapter Active (Zero-config dev) ║');
      if (connection && connection.error) {
        console.log('  ║   ℹ️  Note: Cloud Supabase offline / unreachable      ║');
      }
    }

    if (hasGrok) {
      console.log('  ║   ✅ Grok AI Tutor API loaded                        ║');
    } else {
      console.log('  ║   ⚠️  Grok API key NOT configured                    ║');
    }

    console.log('  ╚══════════════════════════════════════════════════════╝');
    console.log('');
  });

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

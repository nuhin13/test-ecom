import app from './app';
import { config } from './config/env';
import { connectDatabase } from './config/database';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   BD-Sourcing API Server                                  ║
║   Environment: ${config.nodeEnv.padEnd(44)}║
║   Port: ${config.port.toString().padEnd(51)}║
║   Database: Connected                                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

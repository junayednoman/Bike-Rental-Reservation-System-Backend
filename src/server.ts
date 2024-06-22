import mongoose from 'mongoose';
import app from './app';
import { Server } from 'http';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

process.on('unhandledRejection', () => {
  console.log(`unhandledRejection is detected, server shutting down...`);
  if (server) {
    server.close(() => {
      process.exit();
    });
  }
  process.exit();
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected, server shutting down...`);
  process.exit();
});
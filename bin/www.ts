#!/usr/bin/env ts-node

import http from "http";
import dotenv from "dotenv";
dotenv.config({ path: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev' });

import app from "@src/app";

function normalizePort(val: string | undefined): number | string | false {
  if (!val) return 8000;
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const port = normalizePort(process.env.PORT) || 8000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.debug(`Server listening on port ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.debug(`Listening on ${bind}`);
}
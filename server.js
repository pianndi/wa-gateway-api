import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import { koneksi, info } from './socket.js';

import sendRouter from './routes/send.route.js';
import connectionRouter from './routes/connection.route.js';
const { PORT } = process.env;
console.log(PORT)
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const availableRoutes = app._router.stack.filter(r => r.route).map(r => ({ path: r.route.path, methods: r.route.methods }))
  res.json({ message: `WhatsApp Web API v${info.WA_VERSION}`, data: { routes: availableRoutes, info: { CONNECTION: koneksi, ...info } } });
});
app.use(connectionRouter)

app.use((req, res, next) => {
  if (koneksi !== 'open') return res.status(500).json({ message: 'WA belum terhubung' });
  next();
})

app.use('/send', sendRouter);

app.all('*', (req, res) => {
  const routes = app._router.stack.filter(r => r.route).map(r => ({ path: r.route.path, methods: r.route.methods }))
  return res.status(404).json({ message: 'Route not found', routes });
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
});
import express from 'express';
import dotenv from 'dotenv';
import {router as authRoutes,  checkUserCredentials}  from './routes/auth';
import { authMiddleware } from './middleware/auth';
import pool from './db';
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses form data
app.use(cors({
  origin: 'http://localhost:5173',  // frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true                 // if you use cookies/auth headers
}));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["*"],          // allow all sources
      scriptSrc: ["*","'unsafe-inline'","'unsafe-eval'"], 
      styleSrc: ["*","'unsafe-inline'"],
      imgSrc: ["*","data:"],
      fontSrc: ["*"],
      connectSrc: ["*"],
      objectSrc: ["*"],
    },
  })
);
// app.use((req, res, next) => {
//   authRoutes.checkRequestAuth(req, res, next);
// }); // Apply the checkRequestAuth middleware globally

app.use((req, res , next)=>{

  const ok = checkUserCredentials(req);
  if (!ok && !req.url.includes('login'))
    {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  else next();
});

app.use('/auth', authRoutes);
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'protected content', user: req.user });
});

const port = 4000;

async function start() {
  try {
    await pool.query('SELECT 1');
    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (err) {
    console.error('Failed to connect to DB, aborting startup', err);
    process.exit(1);
  }
}

start();

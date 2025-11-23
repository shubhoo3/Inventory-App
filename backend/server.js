const express = require('express');
const app = express();
const productsRouter = require('./routes/products');
const path = require('path');

const PORT = process.env.PORT || 4000;

// basic logging
app.use((req,res,next) => { console.log(req.method, req.url); next(); });

// allow CORS for frontend deploy
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
  next();
});

// mount api
app.use('/api/products', productsRouter);

// health
app.get('/health', (req,res)=>res.json({ ok: true }));

// serve static (optional) — e.g., for basic demo
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

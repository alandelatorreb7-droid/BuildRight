require('dotenv').config();
const express = require('express');
const cors = require('cors');
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/items', itemsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`BuildRight API running on http://localhost:${PORT}`);
});

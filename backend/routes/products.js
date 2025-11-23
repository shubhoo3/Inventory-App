const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const csv = require('csvtojson');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');

// Helpers
function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    category: row.category,
    brand: row.brand,
    stock: Number(row.stock),
    status: row.status,
    image: row.image
  };
}

// GET /api/products
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  res.json(rows.map(rowToProduct));
});

// GET /api/products/search?name=...
router.get('/search', (req, res) => {
  const q = (req.query.name || '').trim();
  if (!q) return res.json([]);
  const rows = db.prepare('SELECT * FROM products WHERE LOWER(name) LIKE ? ORDER BY id DESC')
                 .all(`%${q.toLowerCase()}%`);
  res.json(rows.map(rowToProduct));
});

// GET /api/products/:id/history
router.get('/:id/history', (req, res) => {
  const productId = Number(req.params.id);
  const logs = db.prepare('SELECT * FROM inventory_logs WHERE productId = ? ORDER BY timestamp DESC').all(productId);
  res.json(logs);
});

// PUT /api/products/:id
router.put('/:id', express.json(), (req, res) => {
  const id = Number(req.params.id);
  const { name, unit, category, brand, stock, status, image, changedBy } = req.body;

  // Basic validation
  if (!name || !unit || !category || stock == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (isNaN(stock) || Number(stock) < 0) {
    return res.status(400).json({ error: 'stock must be a number >= 0' });
  }

  // Unique name check (except itself)
  const existing = db.prepare('SELECT id FROM products WHERE LOWER(name) = ? AND id != ?')
                     .get(name.toLowerCase(), id);
  if (existing) {
    return res.status(409).json({ error: 'Product name must be unique' });
  }

  // Get current product for oldStock
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const oldStock = Number(product.stock);
  const newStock = Number(stock);
  const statusToUse = newStock > 0 ? 'In Stock' : 'Out of Stock';

  const update = db.prepare(`
    UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
  `);
  update.run(name, unit, category, brand || null, newStock, statusToUse, image || null, id);

  // If stock changed, insert inventory_log
  if (oldStock !== newStock) {
    const insertLog = db.prepare(`
      INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy) VALUES (?, ?, ?, ?)
    `);
    insertLog.run(id, oldStock, newStock, changedBy || 'admin');
  }

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json(rowToProduct(updated));
});

// POST /api/products/import (multipart/form-data)
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'CSV file required' });
    const filePath = req.file.path;
    const jsonArray = await csv({ trim: true, ignoreEmpty: true }).fromFile(filePath);

    const insertStmt = db.prepare(`
      INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const duplicateList = [];
    let added = 0, skipped = 0;

    const findByName = db.prepare('SELECT id FROM products WHERE LOWER(name) = ?');

    const txn = db.transaction((rows) => {
      for (const r of rows) {
        // expected fields: name,unit,category,brand,stock,status,image
        const name = (r.name || '').trim();
        if (!name) { skipped++; continue; }
        const existing = findByName.get(name.toLowerCase());
        if (existing) {
          duplicateList.push({ name, existingId: existing.id });
          skipped++;
          continue;
        }
        const stock = Number(r.stock || 0);
        const status = stock > 0 ? 'In Stock' : 'Out of Stock';
        insertStmt.run(name, r.unit || '', r.category || '', r.brand || null, stock, status, r.image || null);
        added++;
      }
    });

    txn(jsonArray);

    // remove uploaded file
    fs.unlinkSync(filePath);

    res.json({ added, skipped, duplicates: duplicateList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Import failed', detail: err.message });
  }
});

// GET /api/products/export
router.get('/export', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY id').all();
  // build CSV header
  const header = ['id','name','unit','category','brand','stock','status','image','created_at','updated_at'];
  const lines = [header.join(',')];
  for (const r of rows) {
    const vals = header.map(h => {
      const v = r[h] == null ? '' : String(r[h]).replace(/"/g, '""');
      return `"${v}"`;
    });
    lines.push(vals.join(','));
  }
  const csv = lines.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="products_export_${Date.now()}.csv"`);
  res.send(csv);
});

module.exports = router;

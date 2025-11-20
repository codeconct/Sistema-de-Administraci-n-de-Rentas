// routes/documents.routes.js
import { Router } from 'express';
import pool from '../db.js';  // adjust path if needed

import express from 'express';
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// 📂 Where files will be saved
const uploadFolder = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder); // create folder if not exists
}

// ⚙️ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // unique filename: timestamp-originalName
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// 📤 Upload route (single file)
router.post("/api/documents/upload", upload.single("file"), (req, res) => {
  try {
    // File is saved in /uploads
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // You can also save file info in DB here
    res.json({
      message: "File uploaded successfully",
      filename: file.filename,
      path: `/uploads/${file.filename}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📂 Serve files statically
router.use("/uploads", express.static(uploadFolder));


// ✅ GET all documents
router.get('/documents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET document by ID
router.get('/documents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM documents WHERE documentid = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE document
router.post('/documents', async (req, res) => {
  const { contractid, type, filepath } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO documents (contractid, type, filepath)
       VALUES ($1, $2, $3) RETURNING *`,
      [contractid, type, filepath]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE document
router.put('/documents/:id', async (req, res) => {
  const { id } = req.params;
  const { contractid, type, filepath } = req.body;
  try {
    const result = await pool.query(
      `UPDATE documents
       SET contractid = $1, type = $2, filepath = $3
       WHERE documentid = $4 RETURNING *`,
      [contractid, type, filepath, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE document
router.delete('/documents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM documents WHERE documentid = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: `Document ${id} deleted`, document: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
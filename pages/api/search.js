import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed, cuy!' });
  }

  const { nik, nama, nkk, kelurahan, mode = 'exact' } = req.query;

  const dbPath = path.join(process.cwd(), 'data', 'database.json');
  const rawData = fs.readFileSync(dbPath, 'utf8');
  
  // Parse format baru: { "database": [...] }
  const parsed = JSON.parse(rawData);
  const database = parsed.database || [];

  if (!Array.isArray(database)) {
    return res.status(500).json({ error: 'Format database salah, cuy!' });
  }

  let results = [];

  // Mode fuzzy search (untuk nama)
  if (mode === 'fuzzy' && nama) {
    const fuseOptions = {
      keys: ['nama', 'tempat_lahir', 'kelurahan'],
      threshold: 0.3,
      includeScore: true
    };
    const fuse = new Fuse(database, fuseOptions);
    results = fuse.search(nama).map(match => ({
      ...match.item,
      confidence: Math.round((1 - match.score) * 100) + '%'
    }));
  } 
  // Exact match NIK
  else if (nik) {
    results = database.filter(item => item.nik === nik);
  } 
  // Exact match NKK
  else if (nkk) {
    results = database.filter(item => item.nkk === nkk);
  } 
  // Partial match Nama (case insensitive)
  else if (nama) {
    const regex = new RegExp(nama, 'i');
    results = database.filter(item => regex.test(item.nama));
  }
  // Filter by kelurahan
  else if (kelurahan) {
    const regex = new RegExp(kelurahan, 'i');
    results = database.filter(item => regex.test(item.kelurahan));
  } 
  else {
    return res.status(400).json({ 
      error: 'Kasih parameter dong! nik, nama, nkk, atau kelurahan',
      example: '/api/search?nik=6201010103030003'
    });
  }

  if (results.length === 0) {
    return res.status(404).json({ 
      status: 'not_found',
      message: 'Data gak ketemu, cuy. Coba parameter lain.',
      total_data: database.length
    });
  }

  res.status(200).json({
    status: 'success',
    found: results.length,
    query: { nik, nama, nkk, kelurahan, mode },
    total_database: database.length,
    timestamp: new Date().toISOString(),
    data: results
  });
}

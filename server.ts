import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("app.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    type TEXT, -- 'image' or 'video'
    caption TEXT
  );
  CREATE TABLE IF NOT EXISTS music_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_name TEXT,
    artist TEXT,
    suggested_by TEXT,
    approved INTEGER DEFAULT 0
  );
`);

const defaultConfig = {
  welcome_text: "Você é nosso convidado especial para celebrar esse momento único do aniversário de 15 anos de Maitê e Maysa!",
  event_date: "30 de abril de 2026",
  whatsapp_link: "https://chat.whatsapp.com/JT6xbkr5TBLDa7035h1Pi7",
  location_name: "Nativas Grill",
  location_address: "Rua 89, nº 117 - Setor Sul, Goiânia - GO",
  location_map_link: "https://www.google.com/maps/search/?api=1&query=Nativas+Grill+Goiânia",
  dress_code_men: "Terno",
  dress_code_women: "Vestido Longo",
  gift_clothing_size: "G ou 38/40",
  gift_shoe_size: "36/37",
  gift_perfume: "Florais e Doces",
  gift_makeup: "Tons terrosos e brilho",
  gift_stationery: "Itens de Papelaria",
  gift_cosmetics: "Cosméticos",
  splash_image: "/images/background-home.png",
  hollywood_bg: "/images/background-home.png",
  video_url: "https://youtube.com/shorts/GXqgZEsc24U?feature=share"
};

// Initialize config if empty or update video_url if it was the old one
const rows = db.prepare("SELECT key, value FROM config").all() as { key: string, value: string }[];
if (rows.length === 0) {
  const insert = db.prepare("INSERT INTO config (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(defaultConfig)) {
    insert.run(key, value);
  }
} else {
  // Force update to ensure latest values are used
  db.prepare("UPDATE config SET value = ? WHERE key = 'video_url'").run(defaultConfig.video_url);
  db.prepare("UPDATE config SET value = ? WHERE key = 'hollywood_bg'").run(defaultConfig.hollywood_bg);
  db.prepare("UPDATE config SET value = ? WHERE key = 'splash_image'").run(defaultConfig.splash_image);
  db.prepare("UPDATE config SET value = ? WHERE key = 'dress_code_men'").run(defaultConfig.dress_code_men);
  db.prepare("UPDATE config SET value = ? WHERE key = 'dress_code_women'").run(defaultConfig.dress_code_women);
  db.prepare("UPDATE config SET value = ? WHERE key = 'whatsapp_link'").run(defaultConfig.whatsapp_link);
  db.prepare("UPDATE config SET value = ? WHERE key = 'gift_clothing_size'").run(defaultConfig.gift_clothing_size);
  
  // Ensure new keys exist if they don't
  const insertIfMissing = db.prepare("INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)");
  insertIfMissing.run('gift_stationery', defaultConfig.gift_stationery);
  insertIfMissing.run('gift_cosmetics', defaultConfig.gift_cosmetics);
  
  // Force update them as well
  db.prepare("UPDATE config SET value = ? WHERE key = 'gift_stationery'").run(defaultConfig.gift_stationery);
  db.prepare("UPDATE config SET value = ? WHERE key = 'gift_cosmetics'").run(defaultConfig.gift_cosmetics);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes - Config
  app.get("/api/config", (req, res) => {
    const rows = db.prepare("SELECT key, value FROM config").all();
    const config = rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(config);
  });

  app.post("/api/config", (req, res) => {
    const updates = req.body;
    const updateStmt = db.prepare("UPDATE config SET value = ? WHERE key = ?");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        updateStmt.run(value, key);
      }
    });
    try {
      transaction(updates);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update config" });
    }
  });

  // API Routes - Messages
  app.get("/api/messages", (req, res) => {
    const rows = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
    res.json(rows);
  });

  app.post("/api/messages", (req, res) => {
    const { name, content } = req.body;
    const stmt = db.prepare("INSERT INTO messages (name, content) VALUES (?, ?)");
    stmt.run(name, content);
    res.json({ success: true });
  });

  app.delete("/api/messages/:id", (req, res) => {
    db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Gallery
  app.get("/api/gallery", (req, res) => {
    const rows = db.prepare("SELECT * FROM gallery").all();
    res.json(rows);
  });

  app.post("/api/gallery", (req, res) => {
    const { url, type, caption } = req.body;
    const stmt = db.prepare("INSERT INTO gallery (url, type, caption) VALUES (?, ?, ?)");
    stmt.run(url, type, caption);
    res.json({ success: true });
  });

  app.delete("/api/gallery/:id", (req, res) => {
    db.prepare("DELETE FROM gallery WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Music Suggestions
  app.get("/api/music", (req, res) => {
    const rows = db.prepare("SELECT * FROM music_suggestions").all();
    res.json(rows);
  });

  app.post("/api/music", (req, res) => {
    const { song_name, artist, suggested_by } = req.body;
    const stmt = db.prepare("INSERT INTO music_suggestions (song_name, artist, suggested_by) VALUES (?, ?, ?)");
    stmt.run(song_name, artist, suggested_by);
    res.json({ success: true });
  });

  app.patch("/api/music/:id/approve", (req, res) => {
    db.prepare("UPDATE music_suggestions SET approved = 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/music/:id", (req, res) => {
    db.prepare("DELETE FROM music_suggestions WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

/**
 * Server API for ModularStep Configurator
 * Uses Express and SQLite3 to persist and serve access configuration presets.
 */

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3006;
const DB_PATH = path.join(__dirname, 'presets.db');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('[-] Database connection failed:', err.message);
    } else {
        console.log('[+] Connected to SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS presets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        steps INTEGER NOT NULL,
        platform_length INTEGER NOT NULL,
        step_width INTEGER NOT NULL,
        has_handrails INTEGER NOT NULL,
        load_capacity INTEGER NOT NULL
    )`, (err) => {
        if (err) {
            console.error('[-] Table creation failed:', err.message);
        } else {
            // Seed database if empty
            db.get("SELECT COUNT(*) as count FROM presets", (err, row) => {
                if (!err && row.count === 0) {
                    const stmt = db.prepare("INSERT INTO presets (name, steps, platform_length, step_width, has_handrails, load_capacity) VALUES (?, ?, ?, ?, ?, ?)");
                    stmt.run("ESPERON 3-Step Standard", 3, 1000, 800, 1, 150);
                    stmt.run("ESPERON 5-Step Heavy Duty", 5, 1200, 1000, 1, 200);
                    stmt.run("RUTON Compact Platform", 4, 800, 600, 0, 150);
                    stmt.finalize();
                    console.log('[+] Database seeded with default presets.');
                }
            });
        }
    });
}

// Route: Auth
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'tgnc2000') {
        res.json({ success: true, token: 'session_token_modularstep_2026' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
});

// Route: Get all presets
app.get('/api/presets', (req, res) => {
    db.all("SELECT * FROM presets ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Route: Create preset
app.post('/api/presets', (req, res) => {
    const { name, steps, platform_length, step_width, has_handrails, load_capacity } = req.body;
    if (!name || !steps || !platform_length || !step_width) {
        return res.status(400).json({ error: 'Missing required configuration fields' });
    }
    const query = `INSERT INTO presets (name, steps, platform_length, step_width, has_handrails, load_capacity) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, steps, platform_length, step_width, has_handrails ? 1 : 0, load_capacity || 150], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, id: this.lastID });
        }
    });
});

// Route: Delete preset
app.delete('/api/presets/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM presets WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, deletedCount: this.changes });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[+] ModularStep API Server running on port ${PORT}`);
});

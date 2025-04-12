

const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("./appBcrypt");
const app = express();
const port = 3000;

/* */
app.use(cors());
app.use(express.json());

app.post("/api_v1/roles", (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO role (Role_name) VALUES (?)", [name], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name });
    });
});

app.get("/api_v1/roles", (req, res) => {
    db.all("SELECT * FROM role", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get("/api_v1/roles/:id", (req, res) => {
    db.get("SELECT Role_id, Role_name AS name FROM role WHERE Role_id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.put("/api_v1/roles/:id", (req, res) => {
    const { name } = req.body;
    db.run("UPDATE role SET Role_name = ? WHERE Role_id = ?", [name, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

app.delete("/api_v1/roles/:id", (req, res) => {
    db.run("DELETE FROM role WHERE Role_id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.post("/api_v1/users", async (req, res) => {
    const { user, password, role } = req.body;
    const hashedPassword = await bcrypt.encryptPassword(password);
    db.run("INSERT INTO users (User_email,User_password,Role_fk) VALUES (?,?,?)", [user, hashedPassword, role], function (err) {
        if (err) return res.status(500).json({status:500, error: err.message });
        res.json({ id: this.lastID, user, hashedPassword, role });
    });
});

app.get("/api_v1/users", (req, res) => {
    db.all("SELECT User_id,User_email AS user,User_password AS password,RL.Role_name AS role " 
        +"FROM users AS US INNER JOIN role AS RL ON US.Role_fk=RL.Role_id", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get("/api_v1/users/:id", (req, res) => {
    db.get("SELECT User_id,User_email AS user,User_password AS password,Role_fk AS role "
        +"FROM users WHERE User_id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.put("/api_v1/users/:id", (req, res) => {
    const { user, role } = req.body;
    db.run("UPDATE users SET User_email = ?,Role_fk=? WHERE User_id = ?", [user, role, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

app.delete("/api_v1/users/:id", (req, res) => {
    db.run("DELETE FROM users WHERE User_id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.get("/api_v1/usersRoles",(req, res) => {
    db.all("SELECT RL.Role_name AS role, COUNT(*) AS count FROM users AS US INNER JOIN role AS RL ON US.Role_fk=RL.Role_id GROUP BY US.Role_fk", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/api_v1/login", (req, res) => {
    const { user, password } = req.body;
    db.get("SELECT * FROM users WHERE User_email = ?", [user], async (err, row) => {
        if (err) return res.status(500).json({ status:500,error: "Query error" });
        if (!row) return res.status(401).json({ status:401,error: "User not found" });
        const isMatch = await bcrypt.comparePassword(password, row.User_password);
        if (!isMatch) {
            return res.status(401).json({status:401, message: 'Error password' });
        }
        res.status(200).json({status:200,row});
    });
});

app.put("/api_v1/login", (req, res) => {
    const { email } = req.body;
    db.get("SELECT * FROM users WHERE User_email= ?", [email], function (err,row) {
        if (err) return res.status(500).json({status:500, error: err.message });
        if (!row) return res.status(401).json({ status:401,error: "User not found" });
        res.status(200).json({status:200,email:row.User_email});
    });
});

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});
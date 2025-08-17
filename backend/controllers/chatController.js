const db = require('../config/db');

exports.createConversation = (req, res) => {
  const { user_id, admin_id, mentor_id } = req.body;
  db.query('INSERT INTO conversations (user_id, admin_id, mentor_id) VALUES (?, ?, ?)', [user_id, admin_id, mentor_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
};

exports.sendMessage = (req, res) => {
  const { conversation_id, sender_id, sender_role, message } = req.body;
  db.query('INSERT INTO messages (conversation_id, sender_id, sender_role, message) VALUES (?, ?, ?, ?)', [conversation_id, sender_id, sender_role, message], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
};

exports.getConversationMessages = (req, res) => {
  const { conversation_id } = req.params;
  db.query('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC', [conversation_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getUserConversations = (req, res) => {
  const { user_id } = req.params;
  db.query('SELECT * FROM conversations WHERE user_id = ?', [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

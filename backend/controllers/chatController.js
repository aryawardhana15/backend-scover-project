const db = require('../config/db');

exports.findOrCreateConversation = (req, res) => {
  const { id: participantId, role: participantRole } = req.user;

  if (participantRole === 'admin') {
    return res.status(400).json({ error: "Admins cannot initiate conversations this way." });
  }

  const participantColumn = `${participantRole}_id`;

  // Find the first admin to assign the conversation to
  db.query('SELECT id FROM admin ORDER BY id LIMIT 1', (err, admins) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (admins.length === 0) return res.status(500).json({ error: "No admins available to start a conversation." });
    const adminId = admins[0].id;

    const findQuery = `SELECT * FROM conversations WHERE ${participantColumn} = ? AND admin_id = ?`;
    db.query(findQuery, [participantId, adminId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });

      if (results.length > 0) {
        // Conversation already exists
        return res.json(results[0]);
      } else {
        // Create a new conversation
        const createQuery = `INSERT INTO conversations (${participantColumn}, admin_id) VALUES (?, ?)`;
        db.query(createQuery, [participantId, adminId], (err, result) => {
          if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
          res.status(201).json({ id: result.insertId, [participantColumn]: participantId, admin_id: adminId });
        });
      }
    });
  });
};

exports.adminFindOrCreateConversation = (req, res) => {
  const { id: adminId, role: adminRole } = req.user;
  const { targetId, targetRole } = req.body;

  if (adminRole !== 'admin') {
    return res.status(403).json({ error: "Only admins can use this endpoint." });
  }

  if (!targetId || !targetRole || !['user', 'mentor'].includes(targetRole)) {
    return res.status(400).json({ error: "targetId and targetRole ('user' or 'mentor') are required." });
  }

  const participantColumn = `${targetRole}_id`;

  const findQuery = `SELECT * FROM conversations WHERE ${participantColumn} = ? AND admin_id = ?`;
  db.query(findQuery, [targetId, adminId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });

    if (results.length > 0) {
      return res.json(results[0]);
    } else {
      const createQuery = `INSERT INTO conversations (${participantColumn}, admin_id) VALUES (?, ?)`;
      db.query(createQuery, [targetId, adminId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
        res.status(201).json({ id: result.insertId, [participantColumn]: targetId, admin_id: adminId });
      });
    }
  });
};

exports.sendMessage = (req, res) => {
  const { conversation_id, message } = req.body;
  const { id: sender_id, role: sender_role } = req.user;

  if (!conversation_id || !message) {
    return res.status(400).json({ error: 'conversation_id and message are required.' });
  }

  // Verify that the sender is part of the conversation
  const verifyQuery = 'SELECT * FROM conversations WHERE id = ?';
  db.query(verifyQuery, [conversation_id], (err, conversations) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (conversations.length === 0) return res.status(404).json({ error: 'Conversation not found.' });

    const conv = conversations[0];
    const isParticipant = (sender_role === 'admin' && conv.admin_id === sender_id) ||
                          (sender_role === 'user' && conv.user_id === sender_id) ||
                          (sender_role === 'mentor' && conv.mentor_id === sender_id);

    if (!isParticipant) {
      return res.status(403).json({ error: 'You are not a participant in this conversation.' });
    }

    const insertQuery = 'INSERT INTO messages (conversation_id, sender_id, sender_role, message) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [conversation_id, sender_id, sender_role, message], (err, result) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
      
      // Update the conversation's last message timestamp
      const updateConversationQuery = `
        UPDATE conversations 
        SET last_message_at = NOW() 
        WHERE id = ?
      `;
      db.query(updateConversationQuery, [conversation_id], (err, updateResult) => {
        if (err) {
          console.error("Error updating conversation timestamp:", err);
          // Log the error but proceed to send the message back to the client
        }
        
        const getNewMessageQuery = 'SELECT * FROM messages WHERE id = ?';
        db.query(getNewMessageQuery, [result.insertId], (err, newMessage) => {
          if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
          res.status(201).json(newMessage[0]);
        });
      });
    });
  });
};

// Get messages for a specific conversation
exports.getConversationMessages = (req, res) => {
  const { id: conversation_id } = req.params;
  const { id: userId, role: userRole } = req.user;

  // Verify that the user is part of the conversation
  const verifyQuery = 'SELECT * FROM conversations WHERE id = ?';
  db.query(verifyQuery, [conversation_id], (err, conversations) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    if (conversations.length === 0) return res.status(404).json({ error: 'Conversation not found.' });

    const conv = conversations[0];
    const isParticipant = (userRole === 'admin' && conv.admin_id === userId) ||
                          (userRole === 'user' && conv.user_id === userId) ||
                          (userRole === 'mentor' && conv.mentor_id === userId);

    if (!isParticipant) {
      return res.status(403).json({ error: 'You are not authorized to view this conversation.' });
    }

    // Fetch messages from the 'messages' table, linked to conversations
    const query = 'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC';
    db.query(query, [conversation_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
      res.json(results);
    });
  });
};

exports.getConversationsForUser = (req, res) => {
  const { id: userId, role: userRole } = req.user;

  let query;
  if (userRole === 'admin') {
    // Admin gets all conversations, ordered by last message
    query = `
      SELECT 
        c.id, c.created_at, c.last_message_at,
        u.id as user_id, u.nama as user_nama, u.foto_profil as user_foto,
        m.id as mentor_id, m.nama as mentor_nama, m.foto_profil as mentor_foto,
        a.id as admin_id, a.nama as admin_nama
      FROM conversations c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN mentors m ON c.mentor_id = m.id
      LEFT JOIN admin a ON c.admin_id = a.id
      ORDER BY c.last_message_at DESC
    `;
  } else {
    // User or Mentor gets their own conversations, ordered by last message
    const participantColumn = `${userRole}_id`;
    query = `
      SELECT 
        c.id, c.created_at, c.last_message_at,
        u.id as user_id, u.nama as user_nama, u.foto_profil as user_foto,
        m.id as mentor_id, m.nama as mentor_nama, m.foto_profil as mentor_foto,
        a.id as admin_id, a.nama as admin_nama
      FROM conversations c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN mentors m ON c.mentor_id = m.id
      LEFT JOIN admin a ON c.admin_id = a.id
      WHERE c.${participantColumn} = ?
      ORDER BY c.last_message_at DESC
    `;
  }

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message || 'Database error occurred' });
    res.json(results);
  });
};

// Get all users and mentors for chat (admin can see all)
exports.getAllUsersForChat = (req, res) => {
  const { role } = req.user;
  
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view all users for chat' });
  }

  // Get all users
  const usersQuery = `
    SELECT id, nama, email, 'user' as role, foto_profil 
    FROM users 
    ORDER BY nama
  `;
  
  // Get all mentors
  const mentorsQuery = `
    SELECT id, nama, email, 'mentor' as role, foto_profil 
    FROM mentors 
    ORDER BY nama
  `;

  db.query(usersQuery, (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message || 'Error fetching users' });
    }
    
    db.query(mentorsQuery, (err, mentors) => {
      if (err) {
        return res.status(500).json({ error: err.message || 'Error fetching mentors' });
      }
      
      // Combine users and mentors
      const allUsers = [...users, ...mentors];
      res.json(allUsers);
    });
  });
};

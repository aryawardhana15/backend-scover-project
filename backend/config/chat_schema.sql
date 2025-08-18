CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  admin_id INT,
  mentor_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (admin_id) REFERENCES admin(id),
  FOREIGN KEY (mentor_id) REFERENCES mentors(id)
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  sender_role ENUM('user', 'admin', 'mentor') NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

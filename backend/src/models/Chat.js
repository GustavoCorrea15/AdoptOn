const pool = require('../config/database');

class Chat {
  static async getConversations(userId) {
    const query = `
      SELECT DISTINCT
        CASE 
          WHEN m.remetente_id = $1 THEN m.destinatario_id 
          ELSE m.remetente_id 
        END as participant_id,
        u.nome as participant_name,
        a.nome as animal_name,
        a.id as animal_id,
        a.fotos->0 as animal_photo,
        last_msg.conteudo as last_message,
        last_msg.created_at as last_message_time,
        COALESCE(unread.count, 0) as unread_count
      FROM mensagens m
      JOIN usuarios u ON u.id = CASE 
        WHEN m.remetente_id = $1 THEN m.destinatario_id 
        ELSE m.remetente_id 
      END
      LEFT JOIN animais a ON m.animal_id = a.id
      LEFT JOIN LATERAL (
        SELECT conteudo, created_at
        FROM mensagens m2
        WHERE ((m2.remetente_id = $1 AND m2.destinatario_id = u.id) OR 
               (m2.remetente_id = u.id AND m2.destinatario_id = $1))
        AND m2.animal_id = m.animal_id
        ORDER BY m2.created_at DESC
        LIMIT 1
      ) last_msg ON true
      LEFT JOIN (
        SELECT destinatario_id, animal_id, COUNT(*) as count
        FROM mensagens
        WHERE destinatario_id = $1 AND lida = false
        GROUP BY destinatario_id, animal_id
      ) unread ON unread.destinatario_id = $1 AND unread.animal_id = m.animal_id
      WHERE m.remetente_id = $1 OR m.destinatario_id = $1
      ORDER BY last_msg.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getMessages(userId, participantId, animalId) {
    const query = `
      SELECT 
        m.*,
        u.nome as sender_name
      FROM mensagens m
      JOIN usuarios u ON m.remetente_id = u.id
      WHERE ((m.remetente_id = $1 AND m.destinatario_id = $2) OR 
             (m.remetente_id = $2 AND m.destinatario_id = $1))
      AND m.animal_id = $3
      ORDER BY m.created_at ASC
    `;
    
    const result = await pool.query(query, [userId, participantId, animalId]);
    
    // Marcar mensagens como lidas
    await pool.query(`
      UPDATE mensagens 
      SET lida = true, data_leitura = NOW()
      WHERE destinatario_id = $1 AND remetente_id = $2 AND animal_id = $3 AND lida = false
    `, [userId, participantId, animalId]);
    
    return result.rows;
  }

  static async createMessage(messageData) {
    const { remetente_id, destinatario_id, animal_id, conteudo, tipo_mensagem } = messageData;
    
    const query = `
      INSERT INTO mensagens (remetente_id, destinatario_id, animal_id, conteudo, tipo_mensagem)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [remetente_id, destinatario_id, animal_id, conteudo, tipo_mensagem]);
    return result.rows[0];
  }

  static async markAsRead(messageId, userId) {
    const query = `
      UPDATE mensagens 
      SET lida = true, data_leitura = NOW()
      WHERE id = $1 AND destinatario_id = $2
    `;
    
    await pool.query(query, [messageId, userId]);
  }
}

module.exports = Chat;
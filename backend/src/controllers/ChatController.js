const Chat = require('../models/Chat');

class ChatController {
  static async getConversations(req, res) {
    try {
      const conversations = await Chat.getConversations(req.user.id);
      
      res.json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async getMessages(req, res) {
    try {
      const { participantId, animalId } = req.params;
      const messages = await Chat.getMessages(req.user.id, participantId, animalId);
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { destinatario_id, animal_id, conteudo, tipo_mensagem = 'text' } = req.body;
      
      const messageData = {
        remetente_id: req.user.id,
        destinatario_id,
        animal_id,
        conteudo,
        tipo_mensagem
      };

      const message = await Chat.createMessage(messageData);
      
      // Emitir mensagem via Socket.IO
      const roomId = `chat_${Math.min(req.user.id, destinatario_id)}_${Math.max(req.user.id, destinatario_id)}_${animal_id}`;
      req.io.to(roomId).emit('receive_message', {
        ...message,
        sender_name: req.user.nome
      });

      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { messageId } = req.params;
      
      await Chat.markAsRead(messageId, req.user.id);
      
      res.json({
        success: true,
        message: 'Mensagem marcada como lida'
      });
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = ChatController;
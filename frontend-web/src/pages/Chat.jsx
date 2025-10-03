import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  TextField,
  IconButton,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PetsIcon from '@mui/icons-material/Pets';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      initializeSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const newSocket = io('http://localhost:3002');
    setSocket(newSocket);

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.close();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (participantId, animalId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/chat/messages/${participantId}/${animalId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const selectChat = (conversation) => {
    setSelectedChat(conversation);
    fetchMessages(conversation.participant_id, conversation.animal_id);
    
    if (socket) {
      socket.emit('join_chat', {
        userId: user.id,
        participantId: conversation.participant_id,
        animalId: conversation.animal_id
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch('http://localhost:3002/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          destinatario_id: selectedChat.participant_id,
          animal_id: selectedChat.animal_id,
          conteudo: newMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        const messageData = {
          ...data.data,
          sender_name: user.nome
        };
        
        setMessages(prev => [...prev, messageData]);
        
        // Enviar via Socket.IO
        if (socket) {
          socket.emit('send_message', {
            destinatarioId: selectedChat.participant_id,
            animalId: selectedChat.animal_id,
            conteudo: newMessage,
            remetenteId: user.id,
            remetenteName: user.nome
          });
        }
        
        setNewMessage('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        💬 Chat - Conversas sobre Adoção
      </Typography>

      <Grid container spacing={2} sx={{ height: '70vh' }}>
        {/* Lista de Conversas */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              Conversas
            </Typography>
            
            {conversations.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <PetsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary">
                  Nenhuma conversa ainda
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manifeste interesse em um animal para iniciar uma conversa
                </Typography>
              </Box>
            ) : (
              <List>
                {conversations.map((conversation) => (
                  <React.Fragment key={`${conversation.participant_id}_${conversation.animal_id}`}>
                    <ListItem
                      button
                      selected={selectedChat?.participant_id === conversation.participant_id && 
                               selectedChat?.animal_id === conversation.animal_id}
                      onClick={() => selectChat(conversation)}
                    >
                      <ListItemAvatar>
                        <Badge 
                          badgeContent={conversation.unread_count > 0 ? conversation.unread_count : null} 
                          color="primary"
                        >
                          <Avatar>
                            {conversation.participant_name.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {conversation.participant_name}
                            </Typography>
                            {conversation.unread_count > 0 && (
                              <Badge badgeContent={conversation.unread_count} color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="primary">
                              🐾 {conversation.animal_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {conversation.last_message}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Área de Chat */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Header do Chat */}
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>
                      {selectedChat.participant_name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">
                        {selectedChat.participant_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🐾 Conversa sobre: {selectedChat.animal_name}
                      </Typography>
                    </Box>
                    {selectedChat.animal_photo && (
                      <Avatar 
                        src={selectedChat.animal_photo} 
                        alt={selectedChat.animal_name}
                        sx={{ width: 40, height: 40 }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Mensagens */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.remetente_id === user.id ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: '70%',
                          bgcolor: message.remetente_id === user.id ? 'primary.main' : 'grey.200',
                          color: message.remetente_id === user.id ? 'white' : 'text.primary'
                        }}
                      >
                        <Typography variant="body2">
                          {message.conteudo}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                          {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input de Mensagem */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <IconButton
                      color="primary"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <PetsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Selecione uma conversa
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Escolha uma conversa da lista para começar a trocar mensagens
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
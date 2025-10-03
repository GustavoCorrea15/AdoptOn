import React, { useState, useEffect } from 'react';
import { Badge, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatNotification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/chat/conversations', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          const totalUnread = data.data.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
          setUnreadCount(totalUnread);
        }
      } catch (error) {
        console.error('Erro ao buscar mensagens não lidas:', error);
      }
    };

    // Buscar inicialmente
    fetchUnreadCount();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <IconButton
      color="inherit"
      onClick={() => navigate('/chat')}
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)'
        }
      }}
    >
      <Badge badgeContent={unreadCount} color="error">
        <ChatIcon />
      </Badge>
    </IconButton>
  );
};

export default ChatNotification;
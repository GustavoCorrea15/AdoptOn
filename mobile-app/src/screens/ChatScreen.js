import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, Paragraph, Title, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const API_URL = 'http://10.0.2.2:3002/api';
const SOCKET_URL = 'http://10.0.2.2:3002';

export default function ChatScreen({ route }) {
  const { participantId, animalId, animalName, participantName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initializeSocket = () => {
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_chat', {
        userId: user.id,
        participantId,
        animalId
      });
    });

    socketRef.current.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/messages/${participantId}/${animalId}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/chat/send`, {
        destinatario_id: participantId,
        animal_id: animalId,
        conteudo: newMessage
      });

      if (response.data.success) {
        const messageData = {
          ...response.data.data,
          sender_name: user.nome
        };
        
        setMessages(prev => [...prev, messageData]);
        
        if (socketRef.current) {
          socketRef.current.emit('send_message', {
            destinatarioId: participantId,
            animalId,
            conteudo: newMessage,
            remetenteId: user.id,
            remetenteName: user.nome
          });
        }
        
        setNewMessage('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.remetente_id === user.id;
    
    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        <Card style={[styles.messageCard, isMyMessage ? styles.myMessageCard : styles.otherMessageCard]}>
          <Card.Content style={styles.messageContent}>
            <Paragraph style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
              {item.conteudo}
            </Paragraph>
            <Paragraph style={styles.messageTime}>
              {new Date(item.created_at).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Title>Carregando conversa...</Title>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Title>{participantName}</Title>
        <Paragraph>🐾 Conversa sobre: {animalName}</Paragraph>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          mode="outlined"
          style={styles.textInput}
          multiline
          maxLength={500}
        />
        <Button
          mode="contained"
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
          style={styles.sendButton}
        >
          {sending ? <ActivityIndicator color="white" size="small" /> : '📤'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
  },
  myMessageCard: {
    backgroundColor: '#2196F3',
  },
  otherMessageCard: {
    backgroundColor: 'white',
  },
  messageContent: {
    padding: 10,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    minWidth: 50,
  },
});
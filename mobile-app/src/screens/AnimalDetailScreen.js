import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Card, Chip, Button, Paragraph, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://10.0.2.2:3002/api';

export default function AnimalDetailScreen({ route, navigation }) {
  const { animal } = route.params;
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleStartChat = async () => {
    if (!user) {
      Alert.alert('Erro', 'Faça login para conversar');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/chat/start`, {
        animal_id: animal.id,
        mensagem: `Olá! Tenho interesse em conhecer mais sobre ${animal.nome}. Podemos conversar?`
      });

      if (response.data.success) {
        navigation.navigate('Chat', { 
          participantId: animal.ong_usuario_id,
          animalId: animal.id,
          animalName: animal.nome,
          participantName: animal.ong_nome
        });
      } else {
        Alert.alert('Erro', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao iniciar conversa');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionInterest = async () => {
    if (!user) {
      Alert.alert('Erro', 'Faça login para manifestar interesse');
      return;
    }

    Alert.prompt(
      'Manifestar Interesse',
      'Conte um pouco sobre você:',
      async (message) => {
        if (message) {
          setLoading(true);
          try {
            const response = await axios.post(`${API_URL}/adoptions/interest`, {
              animal_id: animal.id,
              mensagem: message
            });

            if (response.data.success) {
              Alert.alert('Sucesso', 'Interesse manifestado com sucesso!');
              handleStartChat();
            } else {
              Alert.alert('Erro', response.data.error);
            }
          } catch (error) {
            Alert.alert('Erro', 'Erro ao manifestar interesse');
          } finally {
            setLoading(false);
          }
        }
      }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover 
          source={{ uri: animal.fotos?.[0] || 'https://via.placeholder.com/400x300' }} 
          style={styles.image}
        />
        <Card.Content>
          <Title style={styles.title}>{animal.nome}</Title>
          
          <View style={styles.chipContainer}>
            <Chip mode="outlined">{animal.especie === 'cao' ? '🐕 Cão' : '🐱 Gato'}</Chip>
            <Chip mode="outlined">{animal.raca}</Chip>
            <Chip mode="outlined">{Math.floor(animal.idade / 12)} anos</Chip>
            <Chip mode="outlined">{animal.sexo === 'macho' ? 'Macho' : 'Fêmea'}</Chip>
            <Chip mode="outlined">Porte {animal.porte}</Chip>
          </View>

          <Paragraph style={styles.description}>{animal.descricao}</Paragraph>

          <Title style={styles.sectionTitle}>Características</Title>
          <View style={styles.infoContainer}>
            <Paragraph>Peso: {animal.peso} kg</Paragraph>
            <Paragraph>Cor: {animal.cor}</Paragraph>
            <Paragraph>Energia: {animal.nivel_energia}</Paragraph>
            <Paragraph>Sociabilidade: {animal.sociabilidade}</Paragraph>
          </View>

          <Title style={styles.sectionTitle}>Cuidados Veterinários</Title>
          <View style={styles.chipContainer}>
            {animal.castrado && <Chip mode="outlined" textStyle={styles.greenText}>✅ Castrado</Chip>}
            {animal.vacinado && <Chip mode="outlined" textStyle={styles.greenText}>✅ Vacinado</Chip>}
            {animal.vermifugado && <Chip mode="outlined" textStyle={styles.greenText}>✅ Vermifugado</Chip>}
            {animal.microchip && <Chip mode="outlined" textStyle={styles.greenText}>✅ Microchip</Chip>}
          </View>

          <Title style={styles.sectionTitle}>ONG Responsável</Title>
          <Paragraph>{animal.ong_nome}</Paragraph>
          <Paragraph>{animal.ong_cidade}</Paragraph>
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button 
            mode="outlined" 
            onPress={handleStartChat}
            disabled={loading}
            style={styles.button}
          >
            💬 Conversar
          </Button>
          <Button 
            mode="contained" 
            onPress={handleAdoptionInterest}
            disabled={loading}
            style={styles.button}
          >
            {loading ? <ActivityIndicator color="white" /> : '❤️ Manifestar Interesse'}
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
  },
  image: {
    height: 300,
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 5,
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  description: {
    marginVertical: 15,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  greenText: {
    color: 'green',
  },
  actions: {
    flexDirection: 'column',
    gap: 10,
    padding: 15,
  },
  button: {
    width: '100%',
  },
});
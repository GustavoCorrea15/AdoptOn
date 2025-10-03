import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Title, Card, Chip, Button, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://10.0.2.2:3002/api';

export default function HomeScreen({ navigation }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get(`${API_URL}/animals`);
      if (response.data.success) {
        setAnimals(response.data.data.slice(0, 10)); // Primeiros 10
      }
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnimals();
  };

  const renderAnimal = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AnimalDetail', { animal: item })}>
      <Card.Cover 
        source={{ uri: item.fotos?.[0] || 'https://via.placeholder.com/300x200' }} 
        style={styles.image}
      />
      <Card.Content>
        <Title>{item.nome}</Title>
        <View style={styles.chipContainer}>
          <Chip mode="outlined" compact>{item.especie === 'cao' ? '🐕 Cão' : '🐱 Gato'}</Chip>
          <Chip mode="outlined" compact>{item.porte}</Chip>
          <Chip mode="outlined" compact>{Math.floor(item.idade / 12)} anos</Chip>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" compact onPress={() => navigation.navigate('AnimalDetail', { animal: item })}>
          Ver Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Title>Carregando animais...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>🐕❤️ Animais para Adoção</Title>
      <FlatList
        data={animals}
        renderItem={renderAnimal}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 20,
  },
  card: {
    marginBottom: 15,
  },
  image: {
    height: 200,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
    flexWrap: 'wrap',
  },
});
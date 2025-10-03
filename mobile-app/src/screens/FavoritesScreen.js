import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Title, Card, Chip, Button, ActivityIndicator, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://10.0.2.2:3002/api';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites`);
      if (response.data.success) {
        setFavorites(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (animalId) => {
    try {
      const response = await axios.delete(`${API_URL}/favorites/${animalId}`);
      if (response.data.success) {
        setFavorites(prev => prev.filter(fav => fav.id !== animalId));
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const renderFavorite = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AnimalDetail', { animal: item })}>
      <Card.Cover 
        source={{ uri: item.fotos?.[0] || 'https://via.placeholder.com/300x200' }} 
        style={styles.image}
      />
      <Card.Content>
        <Title>{item.nome}</Title>
        <View style={styles.chipContainer}>
          <Chip mode="outlined" compact>{item.especie === 'cao' ? '🐕 Cão' : '🐱 Gato'}</Chip>
          <Chip mode="outlined" compact>{item.raca}</Chip>
          <Chip mode="outlined" compact>{item.porte}</Chip>
        </View>
        <Paragraph numberOfLines={2}>{item.descricao}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={() => removeFavorite(item.id)}>
          💔 Remover
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('AnimalDetail', { animal: item })}>
          Ver Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Title>Carregando favoritos...</Title>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Title>💔 Nenhum favorito ainda</Title>
        <Paragraph style={styles.emptyText}>
          Favorite animais para vê-los aqui!
        </Paragraph>
        <Button mode="contained" onPress={() => navigation.navigate('Search')}>
          Buscar Animais
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>❤️ Meus Favoritos</Title>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id.toString()}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
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
    marginVertical: 10,
    flexWrap: 'wrap',
  },
});
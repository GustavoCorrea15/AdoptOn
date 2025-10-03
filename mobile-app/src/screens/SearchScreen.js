import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Title, Chip, Button, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3002/api';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimals();
  }, []);

  useEffect(() => {
    filterAnimals();
  }, [searchQuery, animals]);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get(`${API_URL}/animals`);
      if (response.data.success) {
        setAnimals(response.data.data);
        setFilteredAnimals(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnimals = () => {
    if (!searchQuery) {
      setFilteredAnimals(animals);
      return;
    }

    const filtered = animals.filter(animal =>
      animal.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.raca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.ong_nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAnimals(filtered);
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
          <Chip mode="outlined" compact>{item.raca}</Chip>
          <Chip mode="outlined" compact>{item.porte}</Chip>
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
        <Title>Carregando...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar por nome, raça ou ONG..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredAnimals}
        renderItem={renderAnimal}
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
  searchbar: {
    marginBottom: 15,
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
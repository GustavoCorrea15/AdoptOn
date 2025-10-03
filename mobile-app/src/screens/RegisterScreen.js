import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Card, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3002/api';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cidade: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        ...formData,
        tipo_usuario: 'adotante'
      });

      if (response.data.success) {
        Alert.alert('Sucesso', 'Conta criada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Erro', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Criar Conta</Title>
          
          <TextInput
            label="Nome *"
            value={formData.nome}
            onChangeText={(text) => setFormData({...formData, nome: text})}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Senha *"
            value={formData.senha}
            onChangeText={(text) => setFormData({...formData, senha: text})}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          <TextInput
            label="Telefone"
            value={formData.telefone}
            onChangeText={(text) => setFormData({...formData, telefone: text})}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />
          
          <TextInput
            label="Cidade"
            value={formData.cidade}
            onChangeText={(text) => setFormData({...formData, cidade: text})}
            mode="outlined"
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : 'Cadastrar'}
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          >
            Já tem conta? Faça login
          </Button>
        </Card.Content>
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
    margin: 20,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 24,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  linkButton: {
    marginTop: 10,
  },
});
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Card, Button, List, Avatar, Divider } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout, style: 'destructive' }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={user?.nome?.charAt(0) || 'U'} 
            style={styles.avatar}
          />
          <Title style={styles.name}>{user?.nome}</Title>
          <List.Item
            title="Email"
            description={user?.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          {user?.telefone && (
            <List.Item
              title="Telefone"
              description={user.telefone}
              left={props => <List.Icon {...props} icon="phone" />}
            />
          )}
          {user?.cidade && (
            <List.Item
              title="Cidade"
              description={user.cidade}
              left={props => <List.Icon {...props} icon="map-marker" />}
            />
          )}
          <List.Item
            title="Tipo de Usuário"
            description={user?.tipo_usuario === 'adotante' ? 'Adotante' : 'ONG'}
            left={props => <List.Icon {...props} icon="account" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <Card.Content>
          <Title>Menu</Title>
          <Divider style={styles.divider} />
          
          <List.Item
            title="Editar Perfil"
            left={props => <List.Icon {...props} icon="account-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* TODO: Implementar edição */}}
          />
          
          <List.Item
            title="Minhas Adoções"
            left={props => <List.Icon {...props} icon="heart" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* TODO: Implementar */}}
          />
          
          <List.Item
            title="Configurações"
            left={props => <List.Icon {...props} icon="cog" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* TODO: Implementar */}}
          />
          
          <List.Item
            title="Sobre o App"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* TODO: Implementar */}}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Sair"
            titleStyle={styles.logoutText}
            left={props => <List.Icon {...props} icon="logout" color="#f44336" />}
            onPress={handleLogout}
          />
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>🐕❤️ Sistema de Adoção Responsável</Title>
          <List.Item
            title="Versão"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
          <List.Item
            title="Desenvolvido com"
            description="React Native + Expo"
            left={props => <List.Icon {...props} icon="react" />}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  profileCard: {
    marginBottom: 15,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    marginBottom: 20,
  },
  menuCard: {
    marginBottom: 15,
  },
  infoCard: {
    marginBottom: 20,
  },
  divider: {
    marginVertical: 10,
  },
  logoutText: {
    color: '#f44336',
  },
});
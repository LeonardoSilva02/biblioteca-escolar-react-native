import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const realizarLogin = async () => {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert('ERRO', 'PREENCHA TODOS OS CAMPOS');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (usuario.toUpperCase() === 'ADMIN' && senha === '123456') {
        navigation.navigate('DrawerNavigator');
      } else {
        Alert.alert('ERRO', 'USUÁRIO OU SENHA INCORRETOS');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2E8B8B', '#4A6FA5', '#6A5ACD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.loginCard}>
          <Text style={styles.title}>Login</Text>
          
          <View style={styles.inputContainer}>
            <Input
              value={usuario}
              onChangeText={setUsuario}
              placeholder="Username"
              autoCapitalize="characters"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              value={senha}
              onChangeText={setSenha}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Button
            title="Login"
            onPress={realizarLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Text style={styles.helpText}>
            Default: ADMIN / 123456
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B8B',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loginButton: {
    backgroundColor: '#4A6FA5',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;

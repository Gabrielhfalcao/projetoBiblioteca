import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from './config';

const InputText = ({ label, value, onChangeText, secureTextEntry }) => (
  <TextInput
    label={label}
    value={value}
    style={{ width: '100%' }}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry} 
  />
);

const ButtonForm = ({ onPress }) => (
  <Button
    mode="contained"
    style={{ backgroundColor: '#0F1C2E', borderRadius: 10 }}
    onPress={onPress}
  >
    Entrar
  </Button>
);

const LoginScreen = () => {
  const [emailOrUsuario, setEmailOrUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [response, setResponse] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/login`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `emailOrUsuario=${emailOrUsuario}&senha=${senha}`
      });
      const text = await response.text();
      if (text === "Usuário ou senha incorretos.") {
        Alert.alert("Erro", "Usuário ou senha incorretos.");
      } else if (text === "Usuário já está logado.") {
        try {
          const tokenUsuarioLogadoResponse = await fetch(`${config.apiBaseUrl}/api/auth/tokenUsuarioLogado?emailOrUsuario=${emailOrUsuario}`);
          const tokenUsuarioLogado = await tokenUsuarioLogadoResponse.text();
          console.log(tokenUsuarioLogado);
          const response = await fetch(`${config.apiBaseUrl}/api/auth/logout?token=${tokenUsuarioLogado}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            navigation.replace('Login');
          } else {
            console.error('Erro ao fazer logout');
          }
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        }
        
      } else if (text === "Por favor, valide seu e-mail antes de fazer login.") {
        Alert.alert("Aviso", text, [
          { text: "OK", onPress: () => navigation.navigate('ValideEmail') }
        ]);
      } else {
        const token = text;
        await fetch(`${config.apiBaseUrl}/api/auth/dadosUsuario?token=${token}`)
        .then(response => response.json())
        .then(dadosUsuario => {
          navigation.navigate('Homepage', { token, dadosUsuario});
        }).catch(error => (console.error(error)));
      }
    } catch (error) {
      console.error(error);
      setResponse("Erro ao conectar ao servidor");
    }
  };

  return (
    <View style={styles.area}>
      <View style={{ flex: 1 }}></View>
      <View style={{ flex: 10 }}>
        <View style={styles.espacoTitulo}>
          <Image
            source={require('./assets/Group 9.png')}
            style={{ width: 220, height: 70 }}
          />
        </View>
        <View style={{ flex: 3 }}>
          <View style={styles.espacoSubtitulo}>
            <Text style={styles.subtitulo}>Login</Text>
          </View>
          <View style={{ flex: 3 }}>
            <View style={styles.espacoInput}>
              <InputText
                label="Email ou Usuário"
                value={emailOrUsuario}
                onChangeText={setEmailOrUsuario}
              />
            </View>
            <View style={styles.espacoInput}>
              <InputText
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true} 
              />
            </View>
            <View style={{ flex: 1 }}>
                <Text
                    style={{ color: 'white', textAlign: 'center', marginTop: 15 }}
                    onPress={() => navigation.navigate('ResetPassword')}>
                    Esqueceu a senha? Clique Aqui
                </Text>
            </View>
          </View>
          <View style={{ flex: 2, width: '80%', margin: 'auto' }}>
            <ButtonForm onPress={handleLogin} />
            <Text
              style={{ color: 'white', textAlign: 'center', marginTop: 15 }}
              onPress={() => navigation.navigate('Register')}
            >
              Não tem conta? Criar conta
            </Text>
            <Text style={{ color: 'white', textAlign: 'center', marginTop: 15 }}>
              {response}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#1F3A5F',
  },
  espacoTitulo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: 'Roboto',
    fontSize: 40,
    color: 'white',
  },
  espacoSubtitulo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitulo: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Roboto',
  },
  espacoInput: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    margin: 'auto',
  },
});

export default LoginScreen;

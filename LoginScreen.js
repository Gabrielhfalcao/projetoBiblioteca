import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const InputText = ({ label, value, onChangeText }) => (
  <TextInput
    label={label}
    value={value}
    style={{ width: '100%' }}
    onChangeText={onChangeText}
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
      const response = await fetch('http://192.168.1.3:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:`emailOrUsuario=${emailOrUsuario}&senha=${senha}`
      });
      const text = await response.text();
      if (text === "Usuário ou senha incorretos.") {
        Alert.alert("Erro", "Usuário ou senha incorretos.");
      } else if (text === "Usuário já está logado.") {
        Alert.alert("Aviso", "Usuário já está logado.");
        navigation.navigate('Homepage');
      } else if (text === "Por favor, valide seu e-mail antes de fazer login.") {
        Alert.alert("Aviso", text, [
          { text: "OK", onPress: () => navigation.navigate('ValideEmail') }
        ]);
      } else {
        const token = text;
        await fetch(`http://192.168.1.3:8080/api/auth/dadosUsuario?token=${token}`)
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
            source={require('./assets/imagem_2024-05-22_172219494-removebg-preview 1.png')}
            style={{ width: 220, height: 220 }}
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

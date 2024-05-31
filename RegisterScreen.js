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

const ButtonForm = ({ onPress, buttonText }) => (
  <Button
    mode="contained"
    style={{ backgroundColor: '#0F1C2E', borderRadius: 10 }}
    onPress={onPress}
  >
    {buttonText}
  </Button>
);

const RegisterScreen = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const navigation = useNavigation(); // Obtenha o objeto de navegação

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.1.3:8080/api/usuarios/cadastrarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, usuario, senha, telefone })
      });

      const text = await response.text();
      if (response.ok) {
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate('ValideEmail') } 
        ]);
      } else if (text === "Email já cadastrado") {
        Alert.alert("Erro", "Email já cadastrado.");
      } else if (text === "Nome de usuário já cadastrado") {
        Alert.alert("Erro", "Nome de usuário já cadastrado.");
      } else {
        Alert.alert("Erro", "Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao conectar ao servidor");
    }
  };

  return (
    <View style={styles.area}>
      <View style={{ flex: 2 }}></View>
      <View style={{ flex: 10 }}>
        <View style={styles.espacoTitulo}>
          <Image
            source={require('./assets/imagem_2024-05-22_172219494-removebg-preview 1.png')}
            style={{ width: 150, height: 150 }}
          />
        </View>
        <View style={{ flex: 25 }}>
          <View style={styles.espacoSubtitulo}>
            <Text style={styles.subtitulo}>Cadastrar</Text>
          </View>
          <View style={{ flex: 3 }}>
            <View style={{ width: "80%", margin: "auto", marginBottom: 60 }}>
              <InputText
                label="Nome"
                value={nome}
                onChangeText={setNome}
              />
            </View>
            <View style={{ width: "80%", margin: "auto", marginBottom: 60 }}>
              <InputText
                label="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={{ width: "80%", margin: "auto", marginBottom: 60 }}>
              <InputText
                label="Usuário"
                value={usuario}
                onChangeText={setUsuario}
              />
            </View>
            <View style={{ width: "80%", margin: "auto", marginBottom: 60 }}>
              <InputText
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
              />
            </View>
            <View style={{ width: "80%", margin: "auto", marginBottom: 2 }}>
              <InputText
                label="Telefone"
                value={telefone}
                onChangeText={setTelefone}
              />
            </View>
          </View>
          <View style={{ flex: 1, width: '80%', margin: 'auto', marginTop: 30 }}>
            <ButtonForm onPress={handleRegister} buttonText="Cadastrar" />
          </View>
        </View>
      </View>
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

export default RegisterScreen;

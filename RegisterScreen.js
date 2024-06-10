import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from './config'; 

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
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/usuarios/cadastrarUsuario`, {
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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/Group 9.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastrar</Text>
        <View style={{marginBottom: 20 }}>
        <InputText
          label="Nome"
          value={nome}
          onChangeText={setNome}
        />
        </View>

        <View style={{marginBottom: 20 }}>
        <InputText
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
        </View>
        
        <View style={{marginBottom: 20 }}>
        <InputText
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />
        </View>

        <View style={{marginBottom: 20 }}>
        <InputText
          label="Usuário"
          value={usuario}
          onChangeText={setUsuario}
        />
        </View>

        <View style={{marginBottom: 20 }}>
        <InputText
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
        />
        </View>

        <View style={{marginBottom: 20 }}>
        <ButtonForm onPress={handleRegister} buttonText="Cadastrar" style={{ marginTop: 10 }}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F3A5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 50,
    justifyContent: 'flex-end',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 50,
  },
  formContainer: {
    width: '80%',
    flex: 5,
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default RegisterScreen;

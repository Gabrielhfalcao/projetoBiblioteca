import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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

const ButtonForm = ({ onPress }) => (
  <Button
    mode="contained"
    style={{ backgroundColor: '#0F1C2E', borderRadius: 10 }}
    onPress={onPress}
  >
    Enviar
  </Button>
);

const ValideEmailScreen = () => {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState('');
  const navigation = useNavigation();

  const handleValidation = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/usuarios/validarEmail?token=${token}`);
      const text = await response.text();
      
      if (response.ok) {
        Alert.alert('Sucesso', text, [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        setResponse(text);
        Alert.alert('Erro', text);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valide seu Email</Text>
      <View style={styles.inputContainer}>
        <InputText
          label="Token"
          value={token}
          onChangeText={setToken}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonForm onPress={handleValidation} />
      </View>
      {response !== '' && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
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
  title: {
    fontFamily: 'Roboto',
    fontSize: 30,
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  responseContainer: {
    marginTop: 20,
  },
  responseText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ValideEmailScreen;

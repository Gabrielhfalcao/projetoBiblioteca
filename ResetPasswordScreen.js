import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button } from 'react-native-paper';
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

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/requestPasswordReset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${email}`
      });

      const text = await response.text();
      if (text === "Email não encontrado") {
        Alert.alert("Erro", "Email não encontrado");
      } else if (text === "Token para mudança de senha enviado para seu email.") {
        navigation.navigate('NewPassword');
      } else {
        console.log(text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Digite seu email</Text>
      </View>
      <View style={styles.inputContainer}>
        <InputText
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonForm onPress={handleResetPassword} buttonText="Enviar" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Roboto',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
});

export default ResetPasswordScreen;

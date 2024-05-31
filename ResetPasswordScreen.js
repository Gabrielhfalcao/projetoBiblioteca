import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button } from 'react-native-paper';

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
  const [email, setEmail] = React.useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://192.168.1.3:8080/api/auth/requestPasswordReset', {
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
    <View style={styles.area}>
      <View style={{ flex: 2 }}></View>
      <View style={{ flex: 5 }}>
        <View style={styles.espacoTitulo}>
          <Text style={styles.subtitulo}>Digite seu email</Text>
        </View>
        <View style={styles.espacoInput}>
          <InputText
            label="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={{ flex: 1, width: '80%', margin: 'auto' }}>
          <ButtonForm onPress={handleResetPassword} buttonText="Enviar" />
        </View>
      </View>
      <View style={{ flex: 2 }}></View>
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

export default ResetPasswordScreen;

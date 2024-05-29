import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button } from 'react-native-paper';

const InputText = ({ label, value, onChangeText, secureTextEntry }) => (
  <TextInput
    label={label}
    value={value}
    style={{ width: '100%' }}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
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

const NewPasswordScreen = () => {
  const [token, setToken] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`https://api-livros-nwwr.onrender.com/api/auth/resetPassword?token=${token}&newPassword=${newPassword}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      const text = await response.text();
      if (text === "Senha alterada com sucesso.") {
        Alert.alert("Sucesso", "Senha alterada com sucesso.");
        navigation.navigate('Login');
      } else {
        Alert.alert("Erro", text);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar alterar a senha.");
    }
  };

  return (
    <View style={styles.area}>
      <View style={{ flex: 2 }}></View>
      <View style={{ flex: 5 }}>
        <View style={styles.espacoTitulo}>
          <Text style={styles.subtitulo}>Nova senha</Text>
        </View>
        <View style={styles.espacoInput}>
          <InputText
            label="Token"
            value={token}
            onChangeText={setToken}
          />
        </View>
        <View style={styles.espacoInput}>
          <InputText
            label="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
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

export default NewPasswordScreen;

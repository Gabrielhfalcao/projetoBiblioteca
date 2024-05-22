import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';


const InputText = () => {
  const [text, setText] = React.useState("");

  return (
    <TextInput
      label="Email"
      value={text}
      style={{width: '100%'}}
      onChangeText={text => setText(text)}
    />
  );
};

const ButtonForm = () => (
  <Button mode="contained" style={{backgroundColor: '#0F1C2E', borderRadius: 10}} onPress={() => console.log('Pressed')}>
    Entrar
  </Button>
);

class App extends Component {
  render() {
    return (
      <View style={styles.area}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 10}}>
          <View style={styles.espacoTitulo}>
            <Image
            source={require('./assets/imagem_2024-05-22_172219494-removebg-preview 1.png')}
            style={{width: 220, height: 220}}
            />
          </View>
          <View style={{ flex: 3}}>
            <View style={styles.espacoSubtitulo}>
              <Text style={styles.subtitulo}>Login</Text>
            </View>
            <View style={{ flex: 3}}>
              <View style={styles.espacoInput}> 
                <InputText/>
              </View>
              <View style={styles.espacoInput}> 
                <InputText/>
              </View>
              <View style={{ flex: 1}}>
                <Text style={{color: 'white', textAlign: 'center'}}>Esqueceu a senha? Clique Aqui</Text>
              </View>
            </View>
            <View style={{ flex: 2, width: '80%', margin: 'auto'}}>
              <ButtonForm/>
              <Text style={{color: 'white', textAlign: 'center', marginTop: 15}}>
              Não tem conta? Criar conta
            </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#1F3A5F'
  },
  espacoTitulo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titulo: {
    fontFamily: 'Roboto',
    fontSize: 40,
    color: 'white'
  },
  espacoSubtitulo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitulo: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Roboto'
  },
  espacoInput: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    margin: 'auto'
  }
});

export default App;

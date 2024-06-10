import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import config from './config'; 

const EditPostScreen = ({ route, navigation }) => {
  const { post, token } = route.params;
  const [titulo, setTitulo] = useState(post.titulo);
  const [autor, setAutor] = useState(post.autor);
  const [descricao, setDescricao] = useState(post.descricao);
  const [fotoLivro1, setFotoLivro1] = useState(post.fotoLivro1);
  const [fotoLivro2, setFotoLivro2] = useState(post.fotoLivro1);

  useEffect(() => {
    setTitulo(post.titulo);
    setAutor(post.autor);
    setDescricao(post.descricao);
  }, [post]);

  const selectImage = (imageNumber) => {
    const options = {
      title: 'Selecione uma imagem',
      mediaType: 'photo',
      quality: 0.5,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        if (imageNumber === 1) {
          setFotoLivro1(response);
        } else {
          setFotoLivro2(response);
        }
      }
    });
  };

  const deleteImage = (imageNumber) => {
    if (imageNumber === 1) {
      setFotoLivro1(null);
    } else {
      setFotoLivro2(null);
    }
  };

  const editarPost = async () => {
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('autor', autor);
      formData.append('descricao', descricao);
      if (fotoLivro1) {
        formData.append('fotoLivro1', {
          uri: fotoLivro1.uri,
          type: fotoLivro1.type,
          name: fotoLivro1.fileName || 'image.jpg',
        });
      }
      if (fotoLivro2) {
        formData.append('fotoLivro2', {
          uri: fotoLivro2.uri,
          type: fotoLivro2.type,
          name: fotoLivro2.fileName || 'image.jpg',
        });
      }

      const response = await fetch(`${config.apiBaseUrl}/api/auth/editarPost/${post.id}?token=${token}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Post editado com sucesso.');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Erro ao editar o post. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao editar o post:', error);
      Alert.alert('Erro', 'Erro ao editar o post. Por favor, tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Publicação</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={autor}
        onChangeText={setAutor}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        multiline
        numberOfLines={4}
        value={descricao}
        onChangeText={setDescricao}
      />
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => selectImage(1)}>
          <Image source={fotoLivro1 ? { uri: fotoLivro1.uri } : require('./assets/placeholder.jpg')} style={styles.image} />
          <View style={styles.overlay}>
            <Icon name="pencil" size={24} color="yellow" />
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(1)}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => selectImage(2)}>
          <Image source={fotoLivro2 ? { uri: fotoLivro2.uri } : require('./assets/placeholder.jpg')} style={styles.image} />
          <View style={styles.overlay}>
            <Icon name="pencil" size={24} color="yellow" />
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(2)}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
      <Button title="Editar" onPress={editarPost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  overlay: {
    position: 'absolute',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default EditPostScreen;

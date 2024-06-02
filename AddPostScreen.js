import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const AddPostScreen = ({ route, navigation }) => {
  const { token } = route.params;
  const [tituloLivro, setTituloLivro] = useState('');
  const [autorLivro, setAutorLivro] = useState('');
  const [idiomaLivro, setIdiomaLivro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaLivro, setCategoriaLivro] = useState('');
  const [fotoLivro1, setFotoLivro1] = useState(null);
  const [fotoLivro2, setFotoLivro2] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.1.3:8080/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const renderCategoriaItems = () => {
    return categorias.map((categoria) => (
      <Picker.Item key={categoria.id} label={categoria.categoria} value={categoria.categoria} />
    ));
  };

  const handleChoosePhoto = async (imageNumber) => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permissão negada para acessar a biblioteca de mídia.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });

    console.log('LOG Imagem selecionada:', result);

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      if (imageNumber === 1) {
        console.log('LOG Atribuindo imagem ao fotoLivro1:', selectedImage.uri);
        setFotoLivro1(selectedImage);
      } else {
        console.log('LOG Atribuindo imagem ao fotoLivro2:', selectedImage.uri);
        setFotoLivro2(selectedImage);
      }
    }
  };

  const publishPost = async () => {
    try {
      if (!tituloLivro || !autorLivro || !categoriaLivro) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const formData = new FormData();
      formData.append('token', token);
      formData.append('tituloLivro', tituloLivro);
      formData.append('autorLivro', autorLivro);
      formData.append('idiomaLivro', idiomaLivro);
      formData.append('descricao', descricao);
      formData.append('categoriaLivro', categoriaLivro);

      if (fotoLivro1) {
        const localUri = fotoLivro1.uri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append('fotoLivro1', {
          uri: localUri,
          name: filename,
          type: fileType,
        });
      }

      if (fotoLivro2) {
        const localUri = fotoLivro2.uri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : `image`;

        formData.append('fotoLivro2', {
          uri: localUri,
          name: filename,
          type: fileType,
        });
      }

      const response = await fetch('http://192.168.1.3:8080/api/auth/addPost', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Post publicado com sucesso.');
        navigation.goBack();
      } else {
        const errorResponse = await response.text();
        Alert.alert('Erro', `Erro ao publicar o post: ${errorResponse}`);
      }
    } catch (error) {
      console.error('Erro ao publicar o post:', error);
      Alert.alert('Erro', 'Erro ao publicar o post. Por favor, tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Publicação</Text>
      <TextInput
        style={styles.input}
        placeholder="Título do Livro *"
        value={tituloLivro}
        onChangeText={setTituloLivro}
      />
      <TextInput
        style={styles.input}
        placeholder="Autor do Livro *"
        value={autorLivro}
        onChangeText={setAutorLivro}
      />
      <TextInput
        style={styles.input}
        placeholder="Idioma do Livro"
        value={idiomaLivro}
        onChangeText={setIdiomaLivro}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        multiline
        numberOfLines={4}
        value={descricao}
        onChangeText={setDescricao}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoriaLivro}
          onValueChange={(itemValue) => setCategoriaLivro(itemValue)}
        >
          <Picker.Item label="Selecione a Categoria" value="" />
          {renderCategoriaItems()}
        </Picker>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => handleChoosePhoto(1)}>
          <View style={styles.imagePlaceholder}>
            {fotoLivro1 ? (
              <Image source={{ uri: fotoLivro1.uri }} style={styles.imagePreview} />
            ) : (
              <Icon name="plus" size={30} color="#aaa" />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChoosePhoto(2)}>
          <View style={styles.imagePlaceholder}>
            {fotoLivro2 ? (
              <Image source={{ uri: fotoLivro2.uri }} style={styles.imagePreview} />
            ) : (
              <Icon name="plus" size={30} color="#aaa" />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <Button title="Publicar" onPress={publishPost} />
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

export default AddPostScreen;

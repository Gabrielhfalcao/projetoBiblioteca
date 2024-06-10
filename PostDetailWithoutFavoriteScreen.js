import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from './config'; 

const PostDetailWithoutFavoriteScreen = ({ route }) => {
  const { postId, token } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, token]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!post) {
    return <Text>Erro ao carregar o post.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={[
          `${config.apiBaseUrl}/api/auth/imagem-livro/${postId}/foto1`,
          `${config.apiBaseUrl}/api/auth/imagem-livro/${postId}/foto2`
        ]}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const slideWidth = Dimensions.get('window').width;
          const currentIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
          setActiveSlide(currentIndex);
        }}
      />
      <View style={styles.pagination}>
        <Text style={styles.paginationText}>{activeSlide + 1} / 2</Text>
      </View>
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{post.livro.titulo}</Text>
          <Text style={styles.description}>Autor: {post.livro.autor}</Text>
          <Text style={styles.description}>Descrição: {post.descricao}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Informações do Anunciante</Text>
          <Text style={styles.infoText}>Nome: {post.usuario.nome}</Text>
          <Text style={styles.infoText}>Telefone: {post.usuario.telefone}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F3A5F',
    flex: 1,
  },
  slide: {
    width: Dimensions.get('window').width,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 20,
    marginTop: 20
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  pagination: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  paginationText: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    alignContent: 'flex-start'
  },
});

export default PostDetailWithoutFavoriteScreen;

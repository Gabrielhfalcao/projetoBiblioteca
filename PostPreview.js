import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from './config';

const PostPreview = ({ postId, token, dadosUsuario }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
  console.log(token);
  console.log(dadosUsuario);
  
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
    <TouchableOpacity style={styles.panel} onPress={() => navigation.navigate('PostDetail', { postId, token })}>
      <View style={styles.column}>
        <Image
          source={{ uri: `${config.apiBaseUrl}/api/auth/imagem-livro/${postId}/foto1` }}
          style={styles.image}
        />
      </View>
      <View style={styles.column}>
        <Text style={styles.title}>{post.livro.titulo}</Text>
        <Text style={styles.author}>{post.livro.autor}</Text>
        <Text style={styles.user}>{post.usuario.nome}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 10,
  },
  column: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 16,
    color: '#555',
  },
  user: {
    fontSize: 14,
    color: '#777',
  },
});

export default PostPreview;

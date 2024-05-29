import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://api-livros-nwwr.onrender.com/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {posts.map(post => (
        <View key={post.id} style={styles.postContainer}>
          <View style={styles.imageColumn}>
            {post.fotoLivro1 ? (
              <Image
                source={{ uri: `https://api-livros-nwwr.onrender.com/api/auth/imagem-livro/${post.id}/foto1` }}
                style={styles.image}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image</Text>
              </View>
            )}
          </View>
          <View style={styles.detailsColumn}>
            <Text style={styles.title}>{post.livro.titulo}</Text>
            <Text style={styles.author}>{post.livro.autor}</Text>
            <Text style={styles.username}>{post.usuario.nome}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  postContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  imageColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsColumn: {
    flex: 2,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 16,
    color: '#555',
  },
  username: {
    fontSize: 14,
    color: '#999',
  },
});

export default PostList;

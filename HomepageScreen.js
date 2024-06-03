import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PostPreview from './PostPreview';

const HomepageScreen = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { dadosUsuario, token } = route.params;

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://192.168.1.3:8080/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (posts.length === 0) {
    return <Text style={styles.errorText}>Nenhum post encontrado.</Text>;
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {posts.map((post) => (
          <PostPreview key={post.id} postId={post.id} token={token} />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerIcon} onPress={onRefresh}>
          <Icon name="home" size={30} color="#1F3A5F" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate('AddPost', { token })}
        >
          <Icon name="plus" size={30} color="#1F3A5F" />
          <Text style={styles.footerText}>Adicionar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => navigation.navigate('Profile', { dadosUsuario, token })}
        >
          <Icon name="user" size={30} color="#1F3A5F" />
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#1F3A5F',
    flexGrow: 1,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F3A5F',
  },
  footerIcon: {
    alignItems: 'center',
  },
  footerText: {
    color: '#1F3A5F',
    fontSize: 12,
  },
});

export default HomepageScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import config from './config'; 

const ProfileScreen = ({ route, navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Publicados');
  const dadosUsuario = route.params?.dadosUsuario;
  const token = route.params?.token;

  console.log(token);

  useEffect(() => {
    const getProfileImage = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/auth/imagem-livro/${dadosUsuario.id}/foto1`);
        setProfileImage({ uri: response.url });
      } catch (error) {
        console.error(error);
        setProfileImage(require('./assets/user_icon.png'));
      } finally {
        setLoading(false);
      }
    };

    if (dadosUsuario && dadosUsuario.id) {
      getProfileImage();
    }
  }, [dadosUsuario]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/logout?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        navigation.replace('Login');
      } else {
        console.error('Erro ao fazer logout');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!dadosUsuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Post adicionado a favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{dadosUsuario.nome}</Text>
        <Text style={styles.subtitle}>{dadosUsuario.usuario}</Text>
        <View style={styles.segmentedControl}>
          <SegmentedButtons
            value={selectedTab}
            onValueChange={setSelectedTab}
            buttons={[
              { value: 'Publicados', label: 'Publicados' },
              { value: 'Favoritados', label: 'Favoritos' },
            ]}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                primary: '#1F3A5F',
                text: 'white',
              },
            }}
          />
        </View>
        <View style={styles.epacoListas}>
          <PostList tab={selectedTab} dadosUsuario={dadosUsuario} navigation={navigation} token={token} />
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const PostList = ({ tab, dadosUsuario, navigation, token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = tab === 'Publicados'
          ? `${config.apiBaseUrl}/api/usuarios/${dadosUsuario.id}/publicacoes`
          : `${config.apiBaseUrl}/api/usuarios/${dadosUsuario.id}/favoritos`;
        const response = await fetch(endpoint);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tab, dadosUsuario.id]);

  const removePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : posts.length === 0 ? (
    <Text style={styles.errorText}>Nenhum post encontrado.</Text>
  ) : (
    <FlatList
      data={posts}
      horizontal
      renderItem={({ item }) => (
        <PostPreview post={item} navigation={navigation} tab={tab} token={token} dadosUsuario={dadosUsuario} removePost={removePost} />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.postList}
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={styles.postPanel.width + 20}
      decelerationRate="fast"
    />
  );
};

const PostPreview = ({ post, navigation, tab, token, removePost }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRemoveFavoriteModal, setShowRemoveFavoriteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleRemoveFavorite = () => {
    setShowRemoveFavoriteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/deletePost/${post.id}?token=${token}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Post excluído com sucesso:', post.id);
        removePost(post.id);
      } else {
        console.error('Erro ao excluir o post:', post.id);
      }
    } catch (error) {
      console.error('Erro ao excluir o post:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmRemoveFavorite = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/removeFavorito/${post.id}?token=${token}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Post removido dos favoritos com sucesso:', post.id);
        removePost(post.id);
      } else {
        console.error('Erro ao remover o post dos favoritos:', post.id);
      }
    } catch (error) {
      console.error('Erro ao remover o post dos favoritos:', error);
    } finally {
      setShowRemoveFavoriteModal(false);
    }
  };

  return (
    <View style={styles.postPanel}>
      <TouchableOpacity onPress={() => navigation.navigate('PostDetailWithoutFavorite', { postId: post.id, token })}>
        <Image source={{ uri: `${config.apiBaseUrl}/api/auth/imagem-livro/${post.id}/foto1` }} style={styles.postImage} />
        <Text style={styles.postTitle}>{post.livro.titulo}</Text>
        <Text style={styles.postAuthor}>{post.livro.autor}</Text>
        <Text style={styles.postUser}>{post.usuario.nome}</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        {tab === 'Publicados' && (
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Icon name="delete" size={20} color="white" />
          </TouchableOpacity>
        )}
        {tab === 'Favoritados' && (
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleRemoveFavorite}>
            <Icon name="delete" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Realmente deseja apagar essa publicação?</Text>
            <View style={styles.modalButtons}>
              <Button title="Excluir" onPress={confirmDelete} />
              <Button title="Cancelar" onPress={() => setShowDeleteModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showRemoveFavoriteModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja remover o post dos favoritos?</Text>
            <View style={styles.modalButtons}>
              <Button title="Confirmar" onPress={confirmRemoveFavorite} />
              <Button title="Cancelar" onPress={() => setShowRemoveFavoriteModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F3A5F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 0,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  info: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#1F3A5F',
  },
  segmentedControl: {
    marginTop: 5,
    alignItems: 'center',
  },
  segmentedButtons: {
    backgroundColor: '#1F3A5F',
    width: '88%',
    borderRadius: 0,
  },
  epacoListas: {
    flex: 1,
    backgroundColor: '#1F3A5F',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postList: {
    paddingHorizontal: 10,
  },
  postPanel: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    width: 150,
  },
  postImage: {
    width: '100%',
    height: '65%',
    borderRadius: 10,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postAuthor: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  postUser: {
    fontSize: 14,
    color: '#777',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#ffd700',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    width: '50%'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;

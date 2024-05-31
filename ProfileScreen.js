import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ route, navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Publicados');
  const dadosUsuario = route.params?.dadosUsuario;
  const token = route.params?.token; 
  console.log("token:" + token)

  useEffect(() => {
    const getProfileImage = async () => {
      try {
        const response = await fetch(`http://192.168.1.3:8080/api/auth/imagem-livro/${dadosUsuario.id}/foto1`);
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
      const response = await fetch(`http://192.168.1.3:8080/api/auth/logout?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        navigation.replace('Login');
      } else {
        
      }
    } catch (error) {
      
    }
  };

  if (!dadosUsuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Erro ao carregar perfil</Text>
        <Text style={styles.error}>Dados do usuário não encontrados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Image
            source={profileImage ? profileImage : require('./assets/user_icon.png')}
            style={styles.profileImage}
          />
        )}
      </View>
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
          <PostList tab={selectedTab} dadosUsuario={dadosUsuario} navigation={navigation} />
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const PostList = ({ tab, dadosUsuario, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = tab === 'Publicados'
          ? `http://192.168.1.3:8080/api/usuarios/${dadosUsuario.id}/publicacoes`
          : `http://192.168.1.3:8080/api/usuarios/${dadosUsuario.id}/favoritos`;
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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (posts.length === 0) {
    return <Text style={styles.errorText}>Nenhum post encontrado.</Text>;
  }

  return (
    <FlatList
      data={posts}
      horizontal
      renderItem={({ item }) => <PostPreview post={item} navigation={navigation} tab={tab} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.postList}
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={styles.postPanel.width + 20}
      decelerationRate="fast"
    />
  );
};

const PostPreview = ({ post, navigation, tab }) => {
  const handleEdit = () => {
    console.log('Edit post:', post.id);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://192.168.1.3:8080/api/auth/deletePost/${post.id}?token=${token}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Post excluído com sucesso:', post.id);
        // Remova o post excluído da lista de posts
        const updatedPosts = posts.filter(item => item.id !== post.id);
        setPosts(updatedPosts); // Atualize a lista de posts
      } else {
        console.error('Erro ao excluir o post:', post.id);
      }
    } catch (error) {
      console.error('Erro ao excluir o post:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <View style={styles.postPanel}>
      <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post.id })}>
        <Image source={{ uri: `http://192.168.1.3:8080/api/auth/imagem-livro/${post.id}/foto1` }} style={styles.postImage} />
        <Text style={styles.postTitle}>{post.livro.titulo}</Text>
        <Text style={styles.postAuthor}>{post.livro.autor}</Text>
        <Text style={styles.postUser}>{post.usuario.nome}</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        {tab === 'Publicados' && (
          <>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
              <Icon name="pencil" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Icon name="delete" size={20} color="white" />
            </TouchableOpacity>
          </>
        )}
        {tab === 'Favoritados' && (
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
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
    marginBottom: 0,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 0,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.47,
    backgroundColor: '#1F3A5F',
},
profileImage: {
  width: 150,
  height: 150,
  borderRadius: 90,
},
info: {
  flex: 1.05,
  backgroundColor: '#1F3A5F',
},
segmentedControl: {
  marginTop: 5,
  alignItems: 'center',
},
segmentedButtons: {
  backgroundColor: '#1F3A5F',
  borderRadius: 0,
},
epacoListas: {
  flex: 1,
  backgroundColor: '#1F3A5F',
  marginTop: 20,
},
alterarSenha: {
  flex: 0.16,
  backgroundColor: 'red',
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
  height: 150,
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
  justifyContent: 'space-between',
  marginTop: 10,
},
button: {
  padding: 10,
  borderRadius: 5,
},
editButton: {
  backgroundColor: 'yellow',
},
deleteButton: {
  backgroundColor: 'red',
},
errorText: {
  color: 'red',
  textAlign: 'center',
  marginTop: 20,
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
},
modalText: {
  fontSize: 18,
  marginBottom: 20,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-around',
},
});

export default ProfileScreen;


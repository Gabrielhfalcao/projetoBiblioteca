import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper';

const data = [
  {
    id: '1',
    title: 'Memórias Póstumas...',
    author: 'jose maria',
    neighborhood: 'Benfica',
    returnTime: '2 dias',
    description: 'Memórias Póstumas de Brás Cubas é um romance escrito por Machado de Assis...',
    image: './assets/CapaLivro.png',
  },
];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Title>{item.title}</Title>
          <Text style={styles.smallText}>publicado por: {item.author}</Text>
          <Text style={styles.smallText}>bairro: {item.neighborhood}</Text>
          <Text style={styles.smallText}>tempo de devolução: {item.returnTime}</Text>
          <Paragraph>{item.description}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => {}} />
        <TextInput
          placeholder="procurar"
          value={searchQuery}
          onChangeText={(query) => setSearchQuery(query)}
          style={styles.searchInput}
        />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F3A5F',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 10,
    backgroundColor: '#DCE3F5',
  },
  cardContent: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 150,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  smallText: {
    color: '#666',
  },
});

export default HomeScreen;

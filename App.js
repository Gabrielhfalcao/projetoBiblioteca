import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ValideEmailScreen from './ValideEmailScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import NewPasswordScreen from './NewPasswordScreen';
import HomepageScreen from './HomepageScreen';
import PostDetailScreen from './PostDetailScreen';
import ProfileScreen from './ProfileScreen';
import EditPostScreen from './EditPostScreen'; // Importe a tela de edição de post aqui
import AddPostScreen from './AddPostScreen'; // Importe a tela de adição de post aqui

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ValideEmail" component={ValideEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Homepage" component={HomepageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Detalhes da Publicação' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Editar Publicação' }} /> 
        <Stack.Screen name="AddPost" component={AddPostScreen} options={{ title: 'Adicionar Publicação' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

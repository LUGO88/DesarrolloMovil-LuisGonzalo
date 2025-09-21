import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importar las pantallas
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Inicio',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
          }} 
        />
        <Stack.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ 
            title: 'Mapa de Ubicación',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
          }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: 'Mi Perfil',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

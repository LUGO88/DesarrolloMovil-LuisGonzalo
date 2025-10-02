import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useCalorieStore from '../store/calorieStore';

// Screens
import DiaryScreen from '../screens/DiaryScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Custom Tab Icon Component
const TabIcon = ({ icon, color }) => (
  <Text style={{ fontSize: 24, color }}>{icon}</Text>
);

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Diary" 
        component={DiaryScreen}
        options={{
          title: 'Diario',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📊" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="AddFood" 
        component={AddFoodScreen}
        options={{
          title: 'Añadir',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="➕" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="👤" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Component
const AppNavigator = () => {
  const { loadData } = useCalorieStore();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
};

export default AppNavigator;
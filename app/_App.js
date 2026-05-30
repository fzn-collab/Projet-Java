import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DashboardScreen from './_screens/DashboardScreen';
import ProjectFormScreen from './_screens/ProjectFormScreen';
import ProjectsScreen from './_screens/ProjectsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: '🚀 ConnectEntrepreneurs' }}
        />
        <Stack.Screen
          name="Projects"
          component={ProjectsScreen}
          options={{ title: '📋 Mes Projets' }}
        />
        <Stack.Screen
          name="ProjectForm"
          component={ProjectFormScreen}
          options={{ title: '📝 Projet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
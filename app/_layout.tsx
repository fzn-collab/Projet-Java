import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: '🚀 ConnectEntrepreneurs' }}
        />
        <Stack.Screen name="projects" options={{ title: '📋 Mes Projets' }} />
        <Stack.Screen name="project-form" options={{ title: '📝 Projet' }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

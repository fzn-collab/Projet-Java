import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProjectDetailsScreen from "../screens/ProjectDetailsScreen";
import ProjectScreen from "../screens/ProjectScreen";
import SearchScreen from "../screens/SearchScreen";
import SuggestionsScreen from "../screens/SuggestionsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Accueil" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Suggestions" component={SuggestionsScreen} />
      <Stack.Screen name="Recherche" component={SearchScreen} />
      <Stack.Screen name="Projets" component={ProjectScreen} />
      <Stack.Screen name="Profil" component={ProfileScreen} />
      <Stack.Screen name="ProjetDetails" component={ProjectDetailsScreen} />
    </Stack.Navigator>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditProfileScreen from "../screens/EditProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProjectDetailsScreen from "../screens/ProjectDetailsScreen";
import ProjectScreen from "../screens/ProjectScreen";
import SearchScreen from "../screens/SearchScreen";
import SuggestionsScreen from "../screens/SuggestionsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0D47A1",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarIcon: ({ color, size }) => {
          let icon = "home-outline";

          if (route.name === "Home") icon = "home-outline";
          if (route.name === "Search") icon = "search-outline";
          if (route.name === "Projects") icon = "folder-outline";
          if (route.name === "Suggestions") icon = "people-outline";
          if (route.name === "MyProfile") icon = "person-outline";

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Projects" component={ProjectScreen} />
      <Tab.Screen name="Suggestions" component={SuggestionsScreen} />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="Profil" component={ProfileScreen} />
      <Stack.Screen name="ProjetDetails" component={ProjectDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

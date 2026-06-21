import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import MessagesPlaceholderScreen from "../screens/MessagesPlaceholderScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import ProjectScreen from "../screens/ProjectScreen";
import SearchScreen from "../screens/SearchScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

const tabIcon =
  (name, outlineName) =>
  ({ color, size, focused }) => (
    <Ionicons name={focused ? name : outlineName} size={size} color={color} />
  );

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentBlue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: tabIcon("home", "home-outline"),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: "Search",
          tabBarIcon: tabIcon("search", "search-outline"),
        }}
      />
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectScreen}
        options={{
          title: "Projects",
          tabBarIcon: tabIcon("briefcase", "briefcase-outline"),
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesPlaceholderScreen}
        options={{
          title: "Messages",
          tabBarIcon: tabIcon("chatbubbles", "chatbubbles-outline"),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={MyProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: tabIcon("person", "person-outline"),
        }}
      />
    </Tab.Navigator>
  );
}

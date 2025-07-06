import { Tabs, Redirect } from 'expo-router';
import { Home, Package, Users, MessageCircle, Menu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/theme';

function TabBarBackground() {
  return (
    <LinearGradient
      colors={[COLORS.dark.primary, COLORS.dark.secondary]}
      style={StyleSheet.absoluteFillObject}
    />
  );
}

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 1,
          borderTopColor: COLORS.dark.border,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: COLORS.neon.blue,
        tabBarInactiveTintColor: COLORS.gray.light,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produits',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="suppliers"
        options={{
          title: 'Fournisseurs',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Discussions',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
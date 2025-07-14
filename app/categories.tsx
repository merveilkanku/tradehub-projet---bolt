import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme'; // Ajustez le chemin si nécessaire

const DUMMY_CATEGORIES = [
  { id: '1', name: 'Électronique', icon: '📱' },
  { id: '2', name: 'Mode & Vêtements', icon: '👕' },
  { id: '3', name: 'Maison & Jardin', icon: '🏠' },
  { id: '4', name: 'Automobile', icon: '🚗' },
  { id: '5', name: 'Sports & Loisirs', icon: '⚽' },
  { id: '6', name: 'Beauté & Santé', icon: '💄' },
  { id: '7', name: 'Livres & Médias', icon: '📚' },
  { id: '8', name: 'Artisanat Local', icon: '🎨' },
  { id: '9', name: 'Services', icon: '🛠️' },
  { id: '10', name: 'Alimentation', icon: '🍔' },
];

export default function CategoriesScreen() {

  const renderCategoryItem = ({ item }: { item: typeof DUMMY_CATEGORIES[0] }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/(tabs)/products?category=${encodeURIComponent(item.name)}`)}
    >
      <LinearGradient
        colors={[COLORS.dark.card, COLORS.dark.surface]}
        style={styles.categoryGradient}
      >
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={styles.categoryName}>{item.name}</Text>
        <ChevronRight size={24} color={COLORS.neon.blue} />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Toutes les Catégories',
          headerStyle: { backgroundColor: COLORS.dark.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontFamily: FONTS.bold },
        }}
      />
      <LinearGradient colors={COLORS.gradients.dark} style={StyleSheet.absoluteFillObject} />

      <FlatList
        data={DUMMY_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    padding: SIZES.md,
  },
  categoryItem: {
    marginBottom: SIZES.sm,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.md,
  },
  categoryIcon: {
    fontSize: SIZES.h3,
    marginRight: SIZES.md,
  },
  categoryName: {
    flex: 1,
    fontSize: SIZES.h4,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
});

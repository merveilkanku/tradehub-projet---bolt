import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Globe, Users, Bell, Search, Heart } from 'lucide-react-native';
import { Link, router } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { supabase, Database } from '../../lib/supabase';

const { width } = Dimensions.get('window');

type Product = Database['public']['Tables']['products']['Row'];

// Données par défaut pour les produits
const defaultProducts: Product[] = [
  {
    id: '1',
    supplier_id: 'default-1',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'Smartphone Apple dernière génération, état neuf avec garantie',
    price: 1200,
    currency: 'USD',
    category: 'Électronique',
    images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'],
    country: 'République Démocratique du Congo',
    city: 'Kinshasa',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    supplier_id: 'default-2',
    title: 'Robe Africaine Traditionnelle',
    description: 'Belle robe en wax authentique, taille M, parfaite pour les occasions spéciales',
    price: 85,
    currency: 'USD',
    category: 'Mode & Vêtements',
    images: ['https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400'],
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    supplier_id: 'default-3',
    title: 'Ordinateur Portable Dell XPS',
    description: 'Laptop professionnel, Intel i7, 16GB RAM, 512GB SSD, parfait pour le travail',
    price: 950,
    currency: 'USD',
    category: 'Électronique',
    images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400'],
    country: 'Sénégal',
    city: 'Dakar',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    supplier_id: 'default-4',
    title: 'Sac à Main en Cuir',
    description: 'Sac artisanal en cuir véritable, fait main par des artisans locaux',
    price: 120,
    currency: 'USD',
    category: 'Mode & Vêtements',
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400'],
    country: 'Maroc',
    city: 'Casablanca',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    supplier_id: 'default-5',
    title: 'Café Arabica Premium',
    description: 'Café de haute qualité, torréfaction artisanale, 1kg',
    price: 45,
    currency: 'USD',
    category: 'Alimentation',
    images: ['https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400'],
    country: 'Rwanda',
    city: 'Kigali',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    supplier_id: 'default-6',
    title: 'Sculpture en Bois d\'Ébène',
    description: 'Œuvre d\'art traditionnelle sculptée à la main, pièce unique',
    price: 200,
    currency: 'USD',
    category: 'Artisanat Local',
    images: ['https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=400'],
    country: 'Cameroun',
    city: 'Douala',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        // Utiliser les données par défaut en cas d'erreur
        setFeaturedProducts(defaultProducts);
      } else {
        // Combiner les données de la base avec les données par défaut
        const allProducts = [...(data || []), ...defaultProducts];
        setFeaturedProducts(allProducts.slice(0, 6));
      }
    } catch (error) {
      console.error('Error:', error);
      setFeaturedProducts(defaultProducts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeaturedProducts();
  };

  const stats = [
    { icon: TrendingUp, label: 'Produits actifs', value: '10K+', color: COLORS.neon.blue },
    { icon: Globe, label: 'Pays couverts', value: '20+', color: COLORS.neon.green },
    { icon: Users, label: 'Fournisseurs', value: '2K+', color: COLORS.neon.purple },
  ];

  const categories = [
    { name: 'Électronique', icon: '📱', color: COLORS.neon.blue },
    { name: 'Mode', icon: '👕', color: COLORS.neon.pink },
    { name: 'Maison', icon: '🏠', color: COLORS.neon.green },
    { name: 'Auto', icon: '🚗', color: COLORS.neon.orange },
  ];

  return (
    <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              {user && profile ? (
                <View style={styles.userProfile}>
                  <Image
                    source={{ 
                      uri: profile.avatar_url || 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400' 
                    }}
                    style={styles.userAvatar}
                  />
                  <View>
                    <Text style={styles.greeting}>
                      Bonjour, {profile.full_name?.split(' ')[0] || 'Utilisateur'}
                    </Text>
                    <Text style={styles.location}>
                      {profile.city ? `${profile.city}, ${profile.country}` : 'TradeHub Marketplace'}
                    </Text>
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={styles.greeting}>Bienvenue</Text>
                  <Text style={styles.location}>TradeHub Marketplace</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <LinearGradient
                colors={COLORS.gradients.primary}
                style={styles.notificationGradient}
              >
                <Bell size={24} color={COLORS.white} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push('/search')} // Exemple de route pour la recherche
          >
            <LinearGradient
              colors={[COLORS.dark.card, COLORS.dark.surface]}
              style={styles.searchGradient}
            >
              <Search size={20} color={COLORS.neon.blue} />
              <Text style={styles.searchPlaceholder}>Rechercher un produit...</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <LinearGradient
            colors={COLORS.gradients.primary}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Découvrez TradeHub</Text>
              <Text style={styles.heroSubtitle}>
                La marketplace qui connecte l'Afrique francophone
              </Text>
              <Link href="/(tabs)/products" asChild>
                <TouchableOpacity style={styles.heroButton}>
                  <Text style={styles.heroButtonText}>Explorer maintenant</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View style={styles.heroImage}>
              <Text style={styles.heroIcon}>🏪</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.dark.card, COLORS.dark.surface]}
                style={styles.statGradient}
              >
                <stat.icon size={32} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Catégories populaires</Text>
            <Link href="/categories" asChild> {/* Supposons une page /categories */}
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Voir tout</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <LinearGradient
                  colors={[COLORS.dark.card, COLORS.dark.surface]}
                  style={styles.categoryGradient}
                >
                  <Link href={`/products?category=${category.name}`} asChild> {/* Navigation vers produits filtrés */}
                    <View style={{alignItems: 'center'}}>
                      <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                        <Text style={styles.categoryEmoji}>{category.icon}</Text>
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                  </Link>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produits en vedette</Text>
            <Link href="/(tabs)/products" asChild>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Voir tout</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement des produits...</Text>
            </View>
          ) : featuredProducts.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
              {featuredProducts.map((product) => ( // Envelopper la carte produit avec Link
                <Link href={`/product/${product.id}`} key={product.id} asChild>
                  <TouchableOpacity style={styles.productCard}>
                    <LinearGradient
                      colors={[COLORS.dark.card, COLORS.dark.surface]}
                      style={styles.productGradient}
                    >
                      <Image
                        source={{ uri: product.images[0] || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                          {product.title}
                        </Text>
                        <Text style={styles.productLocation}>
                          {product.city}, {product.country}
                        </Text>
                        <Text style={styles.productPrice}>
                          ${product.price} {product.currency}
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.favoriteButton} onPress={() => console.log('Favori cliqué pour:', product.id)}>
                        <Heart size={16} color={COLORS.neon.pink} />
                      </TouchableOpacity>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>Aucun produit en vedette</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.md,
    paddingTop: SIZES.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  userInfo: {
    flex: 1,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SIZES.md,
    borderWidth: 2,
    borderColor: COLORS.neon.blue + '50',
  },
  greeting: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  location: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    marginTop: SIZES.xs,
  },
  notificationButton: {
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  notificationGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.neon.pink,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  searchBar: {
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    gap: SIZES.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.medium,
  },
  heroBanner: {
    margin: SIZES.md,
    borderRadius: SIZES.radius.xl,
    overflow: 'hidden',
    shadowColor: COLORS.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  heroGradient: {
    flexDirection: 'row',
    padding: SIZES.lg,
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  heroSubtitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SIZES.lg,
  },
  heroButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.lg,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.dark.primary,
  },
  heroImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: 80,
    opacity: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    gap: SIZES.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  statGradient: {
    padding: SIZES.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginTop: SIZES.sm,
  },
  statLabel: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    textAlign: 'center',
    marginTop: SIZES.xs,
  },
  section: {
    marginTop: SIZES.xl,
    paddingHorizontal: SIZES.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  sectionLink: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.neon.blue,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  categoryCard: {
    width: (width - SIZES.md * 2 - SIZES.sm) / 2,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: SIZES.lg,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    textAlign: 'center',
  },
  productsScroll: {
    marginLeft: -SIZES.md,
  },
  productCard: {
    width: 200,
    marginLeft: SIZES.md,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  productGradient: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: SIZES.md,
  },
  productTitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  productLocation: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    marginBottom: SIZES.sm,
  },
  productPrice: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.neon.green,
  },
  favoriteButton: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    backgroundColor: COLORS.dark.primary + '80',
    borderRadius: SIZES.radius.sm,
    padding: SIZES.xs,
  },
  loadingContainer: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  emptyContainer: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.medium,
  },
});
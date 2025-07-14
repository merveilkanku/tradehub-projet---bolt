import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, Heart, MessageCircle, MapPin } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { PRODUCT_CATEGORIES } from '../../constants/locations';
import { supabase, Database } from '../../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];

export default function ProductsScreen() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const params = useLocalSearchParams<{ category?: string }>();
  const router = useRouter();

  useEffect(() => {
    // Si une catégorie est passée en paramètre d'URL, l'utiliser
    if (params.category && params.category !== selectedCategory) {
      setSelectedCategory(params.category);
    } else {
      // Sinon, lancer fetchProducts avec la catégorie sélectionnée actuelle (ou aucune)
      fetchProducts();
    }
  }, [params.category, profile]);

  // Ce useEffect réagit aux changements de selectedCategory (y compris ceux initiés par l'URL)
  // et lance la récupération des produits.
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSetCategory = (category: string) => {
    setSelectedCategory(category);
    // Mettre à jour l'URL pour refléter la catégorie sélectionnée
    // Cela permet de garder l'URL synchronisée avec l'état de l'interface utilisateur
    if (category) {
      router.setParams({ category: category });
    } else {
      // Si "Toutes" est sélectionné, on pourrait vouloir retirer le paramètre
      // Cependant, Expo Router ne semble pas avoir de méthode simple pour supprimer un param.
      // On peut le laisser ou naviguer vers la route sans params.
      // Pour l'instant, laissons-le ou mettons une valeur vide si nécessaire.
      // Alternativement, on pourrait ne pas appeler setParams ici si on veut que l'URL ne change
      // que lorsqu'on arrive via un lien direct avec param.
      // Pour une meilleure expérience utilisateur et des URL partageables, mettons à jour.
      router.setParams({ category: category }); // ou router.setParams({ category: undefined }) si supporté
    }
  };

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (profile?.country) {
        query = query.eq('country', profile.country);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <LinearGradient
        colors={[COLORS.dark.card, COLORS.dark.surface]}
        style={styles.productGradient}
      >
        <Image
          source={{ 
            uri: item.images[0] || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400' 
          }}
          style={styles.productImage}
        />
        
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productCategory}>{item.category}</Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <Heart size={20} color={COLORS.neon.pink} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.productLocation}>
            <MapPin size={14} color={COLORS.gray.light} />
            <Text style={styles.locationText}>
              {item.city}, {item.country}
            </Text>
          </View>
          
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>
              ${item.price} {item.currency}
            </Text>
            <TouchableOpacity style={styles.chatButton}>
              <LinearGradient
                colors={COLORS.gradients.primary}
                style={styles.chatGradient}
              >
                <MessageCircle size={16} color={COLORS.white} />
                <Text style={styles.chatText}>Discuter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Produits
          {selectedCategory ? (
            <Text style={styles.categorySuffix}> ({selectedCategory})</Text>
          ) : (
            profile?.city && <Text style={styles.locationSuffix}> à {profile.city}</Text>
          )}
        </Text>
        <View style={styles.headerInfo}>
          <Filter size={16} color={COLORS.gray.light} />
          <Text style={styles.productCount}>
            {filteredProducts.length} produits disponibles
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <LinearGradient
          colors={[COLORS.dark.card, COLORS.dark.surface]}
          style={styles.searchGradient}
        >
          <Search size={20} color={COLORS.neon.blue} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor={COLORS.gray.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>

      {/* Categories Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === '' && styles.categoryButtonActive
          ]}
          onPress={() => handleSetCategory('')}
        >
          <LinearGradient
            colors={selectedCategory === '' ? COLORS.gradients.primary : ['transparent', 'transparent']}
            style={styles.categoryGradient}
          >
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === '' ? COLORS.white : COLORS.gray.light }
            ]}>
              Toutes
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {PRODUCT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => handleSetCategory(category)}
          >
            <LinearGradient
              colors={selectedCategory === category ? COLORS.gradients.secondary : ['transparent', 'transparent']}
              style={styles.categoryGradient}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category ? COLORS.white : COLORS.gray.light }
              ]}>
                {category}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
          <Text style={styles.emptyText}>
            {selectedCategory 
              ? `Aucun produit dans la catégorie "${selectedCategory}"`
              : searchQuery
              ? `Aucun résultat pour "${searchQuery}"`
              : 'Aucun produit disponible dans votre région'
            }
          </Text>
        </View>
      )}
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
  title: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  locationSuffix: {
    color: COLORS.neon.blue,
    fontSize: SIZES.h4,
  },
  categorySuffix: {
    color: COLORS.neon.purple,
    fontSize: SIZES.h4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
    gap: SIZES.xs,
  },
  productCount: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  searchContainer: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.md,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius.lg,
    gap: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.white,
  },
  clearButton: {
    fontSize: 16,
    color: COLORS.gray.light,
    padding: SIZES.xs,
  },
  categoriesContainer: {
    marginBottom: SIZES.md,
  },
  categoriesContent: {
    paddingHorizontal: SIZES.md,
    gap: SIZES.sm,
  },
  categoryButton: {
    borderRadius: SIZES.radius.full,
    overflow: 'hidden',
  },
  categoryButtonActive: {
    shadowColor: COLORS.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  categoryGradient: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    borderRadius: SIZES.radius.full,
  },
  categoryText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
  },
  productsContainer: {
    padding: SIZES.md,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: SIZES.md,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  productGradient: {
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: SIZES.md,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  productCategory: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.medium,
    color: COLORS.neon.purple,
    backgroundColor: COLORS.neon.purple + '20',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.sm,
  },
  favoriteButton: {
    padding: SIZES.xs,
  },
  productTitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  productDescription: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    marginBottom: SIZES.sm,
  },
  productLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
    gap: SIZES.xs,
  },
  locationText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.neon.green,
  },
  chatButton: {
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    gap: SIZES.xs,
  },
  chatText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.lg,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.medium,
    textAlign: 'center',
    lineHeight: 24,
  },
});
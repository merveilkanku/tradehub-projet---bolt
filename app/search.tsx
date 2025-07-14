import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { Search as SearchIcon, XCircle, Heart } from 'lucide-react-native'; // Renamed Search to SearchIcon
import { LinearGradient } from 'expo-linear-gradient';
import { supabase, Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];

export default function SearchScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      performSearch(debouncedQuery.trim());
    } else {
      setResults([]);
      if(hasSearched) setHasSearched(false); // Reset if query is too short
    }
  }, [debouncedQuery]);

  const performSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      // Using Supabase full-text search with 'websearch_to_tsquery' for better matching
      // Ensure you have a GIN index on the 'title' and 'description' for performance.
      // Example: CREATE INDEX products_search_idx ON products USING GIN (to_tsvector('french', title || ' ' || description));
      // For simplicity, we'll use 'or' with 'ilike' here if FTS is not set up.
      // const { data, error } = await supabase.rpc('search_products', { keyword: query });

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_available', true)
        .limit(20);

      if (error) {
        throw error;
      }
      setResults(data || []);
    } catch (error) {
      console.error('Error performing search:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <LinearGradient
        colors={[COLORS.dark.card, COLORS.dark.surface]}
        style={styles.productGradient}
      >
        <Image
          source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/100' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.productPrice}>{item.price} {item.currency}</Text>
          <Text style={styles.productLocation} numberOfLines={1}>{item.city}, {item.country}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButtonOnCard}>
            <Heart size={16} color={COLORS.neon.pink} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Rechercher un Produit',
          headerStyle: { backgroundColor: COLORS.dark.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontFamily: FONTS.bold },
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <SearchIcon size={22} color={COLORS.neon.blue} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Que recherchez-vous ?"
            placeholderTextColor={COLORS.gray.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => performSearch(searchQuery.trim())} // Allow immediate search on submit
            returnKeyType="search"
            autoFocus={!params.query} // Autofocus if not navigated with a query
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <XCircle size={20} color={COLORS.gray.light} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={COLORS.neon.blue} />
          <Text style={styles.feedbackText}>Recherche en cours...</Text>
        </View>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Aucun résultat</Text>
          <Text style={styles.feedbackText}>
            Nous n'avons trouvé aucun produit correspondant à "{debouncedQuery}".
          </Text>
          <Text style={styles.feedbackText}>Essayez avec d'autres mots-clés.</Text>
        </View>
      )}

      {!loading && !hasSearched && debouncedQuery.length <=2 && debouncedQuery.length > 0 && (
         <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>Continuez à taper pour rechercher...</Text>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.resultsListColumnWrapper}
        contentContainerStyle={styles.resultsListContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
            <>
            {results.length > 0 && !loading && (
                <Text style={styles.resultsCountText}>
                    {results.length} produit{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                </Text>
            )}
            </>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: SIZES.md,
    paddingTop: SIZES.sm,
    backgroundColor: COLORS.dark.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.border,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dark.card,
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: SIZES.md,
  },
  searchIcon: {
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.white,
  },
  clearButton: {
    padding: SIZES.sm,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  feedbackTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  feedbackText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    textAlign: 'center',
    lineHeight: SIZES.body * 1.4,
  },
  resultsListContainer: {
    padding: SIZES.md,
  },
  resultsListColumnWrapper: {
    justifyContent: 'space-between',
    gap: SIZES.md,
  },
  resultsCountText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.gray.light,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  productCard: {
    width: '100%', // FlatList numColumns gère la largeur
    marginBottom: SIZES.md,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  productGradient: {
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    borderRadius: SIZES.radius.lg,
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: SIZES.sm,
  },
  productTitle: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginBottom: SIZES.xs / 2,
  },
  productPrice: {
    fontSize: SIZES.body,
    fontFamily: FONTS.bold,
    color: COLORS.neon.green,
    marginBottom: SIZES.xs / 2,
  },
  productLocation: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.medium,
  },
  favoriteButtonOnCard: {
    position: 'absolute',
    top: SIZES.xs,
    right: SIZES.xs,
    backgroundColor: COLORS.dark.primary + '80',
    borderRadius: SIZES.radius.full,
    padding: SIZES.xs,
  },
});

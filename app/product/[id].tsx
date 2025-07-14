import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ShoppingCart, MessageCircle, Heart, Share2, MapPin, User } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme'; // Ajustez le chemin si nécessaire
import { supabase, Database } from '../../lib/supabase'; // Ajustez le chemin
import { useEffect, useState } from 'react';

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles?: Database['public']['Tables']['profiles']['Row'] | null; // Pour les infos du vendeur
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles (
            id,
            full_name,
            avatar_url,
            city,
            country
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }
      setProduct(data as Product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Gérer l'erreur, par exemple afficher un message
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={{color: COLORS.white}}>Chargement du produit...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={{color: COLORS.white}}>Produit non trouvé.</Text>
      </View>
    );
  }

  const seller = product.profiles;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false, // On gère notre propre header
        }}
      />
      <LinearGradient colors={COLORS.gradients.dark} style={StyleSheet.absoluteFillObject} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Heart size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Image */}
        <Image
          source={{ uri: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400' }}
          style={styles.productImage}
        />

        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>
            {product.price} {product.currency}
          </Text>

          {/* Location */}
          <View style={styles.locationContainer}>
            <MapPin size={16} color={COLORS.gray.light} />
            <Text style={styles.locationText}>{product.city}, {product.country}</Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Seller Info */}
          {seller && (
            <>
              <Text style={styles.sectionTitle}>Vendeur</Text>
              <TouchableOpacity
                style={styles.sellerContainer}
                onPress={() => router.push(`/supplier/${seller.id}`)} // Supposons une page profil vendeur
              >
                <Image
                  source={{ uri: seller.avatar_url || 'https://via.placeholder.com/50' }}
                  style={styles.sellerAvatar}
                />
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{seller.full_name}</Text>
                  <Text style={styles.sellerLocation}>{seller.city}, {seller.country}</Text>
                </View>
                <ChevronRight size={24} color={COLORS.neon.blue} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.chatButton]}>
          <MessageCircle size={24} color={COLORS.white} />
          <Text style={styles.footerButtonText}>Discuter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton, styles.buyButton]}>
          <LinearGradient colors={COLORS.gradients.primary} style={StyleSheet.absoluteFillObject} />
          <ShoppingCart size={24} color={COLORS.white} />
          <Text style={styles.footerButtonText}>Acheter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark.background,
  },
  header: {
    position: 'absolute',
    top: SIZES.statusBarHeight || 40, // Approx status bar height
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    zIndex: 10,
  },
  headerButton: {
    padding: SIZES.sm / 2,
    backgroundColor: COLORS.dark.primary + '80', // Semi-transparent background
    borderRadius: SIZES.radius.full,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  productImage: {
    width: '100%',
    height: Dimensions.get('window').width, // Square image
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: SIZES.md,
    backgroundColor: COLORS.dark.background, // Pour que le contenu scrolle par dessus le gradient
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    marginTop: -SIZES.xl, // Pour que l'image déborde un peu
    zIndex: 5,
  },
  productTitle: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  productPrice: {
    fontSize: SIZES.h1,
    fontFamily: FONTS.black,
    color: COLORS.neon.green,
    marginBottom: SIZES.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  locationText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    marginLeft: SIZES.xs,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
    marginTop: SIZES.lg,
  },
  productDescription: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    lineHeight: SIZES.body * 1.5,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    backgroundColor: COLORS.dark.card,
    borderRadius: SIZES.radius.lg,
    marginTop: SIZES.sm,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.md,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  sellerLocation: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.dark.border,
    backgroundColor: COLORS.dark.primary, // Assurez-vous que le fond est opaque
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden', // Important pour LinearGradient
  },
  footerButtonText: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginLeft: SIZES.sm,
  },
  chatButton: {
    backgroundColor: COLORS.dark.surface,
    marginRight: SIZES.sm,
  },
  buyButton: {
    // Le LinearGradient s'occupe de la couleur
  },
});

// Nécessaire pour les dimensions de l'image
import { Dimensions } from 'react-native';

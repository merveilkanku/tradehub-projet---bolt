import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MapPin, Mail, Phone, Heart, MessageCircle } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { supabase, Database } from '../../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface SupplierProfile extends Profile {
  products: Product[];
}

export default function SupplierProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [supplier, setSupplier] = useState<SupplierProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSupplierData();
    }
  }, [id]);

  const fetchSupplierData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 1. Fetch supplier profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('user_type', 'supplier') // Ensure it's a supplier
        .single();

      if (profileError || !profileData) {
        throw profileError || new Error('Supplier not found or not a supplier.');
      }

      // 2. Fetch supplier's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', id)
        .order('created_at', { ascending: false });

      if (productsError) {
        throw productsError;
      }

      setSupplier({ ...profileData, products: productsData || [] });
    } catch (error) {
      console.error('Error fetching supplier data:', error);
      setSupplier(null); // Ou gérer l'erreur autrement
    } finally {
      setLoading(false);
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <LinearGradient
        colors={[COLORS.dark.card, COLORS.dark.surface]}
        style={styles.productGradient}
      >
        <Image
          source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.productPrice}>{item.price} {item.currency}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButtonOnCard}>
            <Heart size={16} color={COLORS.neon.pink} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <LinearGradient colors={COLORS.gradients.dark} style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.neon.blue} />
        <Text style={styles.loadingText}>Chargement du profil fournisseur...</Text>
      </LinearGradient>
    );
  }

  if (!supplier) {
    return (
      <LinearGradient colors={COLORS.gradients.dark} style={styles.centered}>
         <Stack.Screen options={{
            title: "Erreur",
            headerStyle: { backgroundColor: COLORS.dark.primary },
            headerTintColor: COLORS.white,
            headerTitleStyle: { fontFamily: FONTS.bold },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: SIZES.sm }}>
                <ChevronLeft size={28} color={COLORS.white} />
              </TouchableOpacity>
            ),
          }} />
        <Text style={styles.errorText}>Impossible de charger le profil du fournisseur.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
            <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
      <Stack.Screen
        options={{
          title: supplier.full_name || 'Profil Fournisseur',
          headerStyle: { backgroundColor: COLORS.dark.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontFamily: FONTS.bold },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: SIZES.sm }}>
              <ChevronLeft size={28} color={COLORS.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Supplier Header */}
        <View style={styles.supplierHeader}>
          <Image
            source={{ uri: supplier.avatar_url || 'https://via.placeholder.com/100' }}
            style={styles.supplierAvatar}
          />
          <Text style={styles.supplierName}>{supplier.full_name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={COLORS.gray.light} />
            <Text style={styles.supplierLocationText}>
              {supplier.city}, {supplier.country}
            </Text>
          </View>
          {/* On pourrait ajouter une bio ou description ici si disponible */}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordonnées</Text>
          <View style={styles.contactItem}>
            <Mail size={18} color={COLORS.neon.blue} />
            <Text style={styles.contactText}>{/* Supabase users table for email */ 'Non disponible'}</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={18} color={COLORS.neon.green} />
            <Text style={styles.contactText}>{supplier.phone || 'Non disponible'}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
                <MessageCircle size={20} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Contacter</Text>
            </TouchableOpacity>
            {/* On pourrait ajouter un bouton "Suivre" */}
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produits de {supplier.full_name?.split(' ')[0]}</Text>
          {supplier.products.length > 0 ? (
            <FlatList
              data={supplier.products}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.productListColumnWrapper}
              contentContainerStyle={styles.productListContainer}
              scrollEnabled={false} // Important car c'est dans un ScrollView
            />
          ) : (
            <Text style={styles.noProductsText}>Ce fournisseur n'a aucun produit pour le moment.</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.gray.light,
  },
  errorText: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  supplierHeader: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    backgroundColor: COLORS.dark.surface + '80', // semi-transparent
  },
  supplierAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.neon.blue,
    marginBottom: SIZES.md,
  },
  supplierName: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supplierLocationText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    marginLeft: SIZES.xs,
  },
  section: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.border,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  contactText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    marginLeft: SIZES.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: SIZES.md,
    gap: SIZES.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  actionButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: SIZES.h4,
    marginLeft: SIZES.sm,
  },
  messageButton: {
    backgroundColor: COLORS.neon.blue,
  },
  noProductsText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.medium,
    textAlign: 'center',
    paddingVertical: SIZES.xl,
  },
  productListContainer: {
    // paddingHorizontal: SIZES.xs, // Si besoin d'ajuster l'espacement
  },
  productListColumnWrapper: {
    justifyContent: 'space-between',
    gap: SIZES.md, // Espacement horizontal entre les cartes
  },
  productCard: {
    width: '100%', // La FlatList avec numColumns gère la largeur
    marginBottom: SIZES.md,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
    // backgroundColor: COLORS.dark.card, // Le gradient s'en occupe
  },
  productGradient: {
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    borderRadius: SIZES.radius.lg, // Appliquer aussi ici pour le border
  },
  productImage: {
    width: '100%',
    height: 110, // Un peu plus petit pour les cartes en grille
    resizeMode: 'cover',
  },
  productInfo: {
    padding: SIZES.sm,
  },
  productTitle: {
    fontSize: SIZES.body, // Ajusté pour des cartes plus petites
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginBottom: SIZES.xs / 2,
  },
  productPrice: {
    fontSize: SIZES.h5, // Ajusté
    fontFamily: FONTS.bold,
    color: COLORS.neon.green,
  },
  favoriteButtonOnCard: {
    position: 'absolute',
    top: SIZES.xs,
    right: SIZES.xs,
    backgroundColor: COLORS.dark.primary + '80',
    borderRadius: SIZES.radius.full,
    padding: SIZES.xs,
  },
   button: {
    marginTop: SIZES.lg,
    backgroundColor: COLORS.neon.blue,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.radius.lg,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
  }
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, MapPin, Star, Package, MessageCircle, CheckCircle } from 'lucide-react-native';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { supabase, Database } from '../../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function SuppliersScreen() {
  const { user, profile } = useAuth();
  const [suppliers, setSuppliers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, [profile]);

  const fetchSuppliers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'supplier');

      if (profile?.country) {
        query = query.eq('country', profile.country);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers:', error);
      } else {
        setSuppliers(data || []);
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
    fetchSuppliers();
  };

  const renderSupplier = (supplier: Profile) => (
    <TouchableOpacity key={supplier.id} style={styles.supplierCard}>
      <LinearGradient
        colors={[COLORS.dark.card, COLORS.dark.surface]}
        style={styles.supplierGradient}
      >
        <View style={styles.supplierHeader}>
          <Image
            source={{ 
              uri: supplier.avatar_url || 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400' 
            }}
            style={styles.supplierAvatar}
          />
          
          <View style={styles.supplierInfo}>
            <View style={styles.supplierNameRow}>
              <Text style={styles.supplierName}>{supplier.full_name}</Text>
              {supplier.is_supplier_verified && (
                <CheckCircle size={16} color={COLORS.neon.green} />
              )}
            </View>
            
            <View style={styles.supplierLocation}>
              <MapPin size={14} color={COLORS.gray.light} />
              <Text style={styles.locationText}>
                {supplier.city}, {supplier.country}
              </Text>
            </View>

            <View style={styles.supplierStats}>
              <View style={styles.statItem}>
                <Star size={14} color={COLORS.neon.orange} />
                <Text style={styles.statText}>4.5</Text>
              </View>
              
              <View style={styles.statItem}>
                <Package size={14} color={COLORS.neon.purple} />
                <Text style={styles.statText}>{Math.floor(Math.random() * 50) + 1} produits</Text>
              </View>
            </View>

            {supplier.bio && (
              <Text style={styles.supplierBio} numberOfLines={2}>
                {supplier.bio}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.supplierActions}>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={[COLORS.neon.blue + '20', COLORS.neon.blue + '30']}
              style={styles.actionGradient}
            >
              <MessageCircle size={16} color={COLORS.neon.blue} />
              <Text style={[styles.actionText, { color: COLORS.neon.blue }]}>
                Message
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={[COLORS.neon.purple + '20', COLORS.neon.purple + '30']}
              style={styles.actionGradient}
            >
              <Package size={16} color={COLORS.neon.purple} />
              <Text style={[styles.actionText, { color: COLORS.neon.purple }]}>
                Produits
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Fournisseurs
          {profile?.country && (
            <Text style={styles.locationSuffix}> en {profile.country}</Text>
          )}
        </Text>
        <View style={styles.headerInfo}>
          <Users size={16} color={COLORS.gray.light} />
          <Text style={styles.supplierCount}>
            {suppliers.length} fournisseurs disponibles
          </Text>
        </View>
      </View>

      {/* Suppliers List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement des fournisseurs...</Text>
        </View>
      ) : suppliers.length > 0 ? (
        <ScrollView 
          style={styles.suppliersContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {suppliers.map(renderSupplier)}
          <View style={styles.bottomPadding} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>Aucun fournisseur disponible</Text>
          <Text style={styles.emptyText}>
            {profile?.country 
              ? `Il n'y a pas encore de fournisseurs en ${profile.country}.`
              : 'Connectez-vous pour voir les fournisseurs de votre région.'
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
    color: COLORS.neon.green,
    fontSize: SIZES.h4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
    gap: SIZES.xs,
  },
  supplierCount: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  suppliersContainer: {
    flex: 1,
    paddingHorizontal: SIZES.md,
  },
  supplierCard: {
    marginBottom: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  supplierGradient: {
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  supplierHeader: {
    flexDirection: 'row',
    marginBottom: SIZES.lg,
  },
  supplierAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: SIZES.md,
    borderWidth: 2,
    borderColor: COLORS.neon.blue + '50',
  },
  supplierInfo: {
    flex: 1,
  },
  supplierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
    gap: SIZES.xs,
  },
  supplierName: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  supplierLocation: {
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
  supplierStats: {
    flexDirection: 'row',
    gap: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  statText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  supplierBio: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    lineHeight: 18,
  },
  supplierActions: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    gap: SIZES.xs,
  },
  actionText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
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
  bottomPadding: {
    height: 100,
  },
});
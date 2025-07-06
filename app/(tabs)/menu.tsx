import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Settings, 
  LogOut,
  Edit,
  Star
} from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function MenuScreen() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnecter', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)');
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            }
          }
        }
      ]
    );
  };

  const handleMenuAction = (action: string) => {
    Alert.alert('Information', `Fonctionnalité "${action}" en cours de développement`);
  };

  const menuSections = [
    {
      title: 'Profil',
      items: [
        { 
          icon: User, 
          label: 'Mon profil', 
          action: () => handleMenuAction('Mon profil'),
          color: COLORS.neon.blue
        },
        { 
          icon: Edit, 
          label: 'Modifier le profil', 
          action: () => handleMenuAction('Modifier le profil'),
          color: COLORS.neon.green
        },
        { 
          icon: Heart, 
          label: 'Mes favoris', 
          action: () => handleMenuAction('Mes favoris'),
          color: COLORS.neon.pink
        },
        { 
          icon: ShoppingBag, 
          label: 'Mes commandes', 
          action: () => handleMenuAction('Mes commandes'),
          color: COLORS.neon.orange
        },
      ]
    },
    ...(profile?.user_type === 'supplier' ? [{
      title: 'Fournisseur',
      items: [
        { 
          icon: Package, 
          label: 'Mes produits', 
          action: () => handleMenuAction('Mes produits'),
          color: COLORS.neon.purple
        },
        { 
          icon: CreditCard, 
          label: 'Ventes', 
          action: () => handleMenuAction('Ventes'),
          color: COLORS.neon.green
        },
        { 
          icon: Star, 
          label: 'Évaluations', 
          action: () => handleMenuAction('Évaluations'),
          color: COLORS.neon.yellow
        },
      ]
    }] : []),
    {
      title: 'Paramètres',
      items: [
        { 
          icon: Settings, 
          label: 'Paramètres', 
          action: () => handleMenuAction('Paramètres'),
          color: COLORS.gray.light
        },
        { 
          icon: LogOut, 
          label: 'Se déconnecter', 
          action: handleSignOut,
          color: COLORS.error
        },
      ]
    }
  ];

  return (
    <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
        </View>

        {/* User Info */}
        {user && profile ? (
          <View style={styles.userInfoContainer}>
            <LinearGradient
              colors={[COLORS.dark.card, COLORS.dark.surface]}
              style={styles.userInfoGradient}
            >
              <Image
                source={{ 
                  uri: profile.avatar_url || 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400' 
                }}
                style={styles.userAvatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{profile.full_name}</Text>
                <View style={styles.userTypeContainer}>
                  <LinearGradient
                    colors={profile.user_type === 'supplier' ? COLORS.gradients.secondary : COLORS.gradients.primary}
                    style={styles.userTypeBadge}
                  >
                    <Text style={styles.userTypeText}>
                      {profile.user_type === 'supplier' ? 'Fournisseur' : 'Utilisateur'}
                    </Text>
                  </LinearGradient>
                </View>
                <Text style={styles.userLocation}>
                  {profile.city}, {profile.country}
                </Text>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.guestContainer}>
            <LinearGradient
              colors={[COLORS.dark.card, COLORS.dark.surface]}
              style={styles.guestGradient}
            >
              <View style={styles.guestIcon}>
                <User size={32} color={COLORS.neon.blue} />
              </View>
              <Text style={styles.guestTitle}>Connectez-vous</Text>
              <Text style={styles.guestSubtitle}>
                Accédez à toutes les fonctionnalités de TradeHub
              </Text>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => router.push('/(auth)')}
              >
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  style={styles.loginGradient}
                >
                  <Text style={styles.loginText}>Se connecter</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Menu Sections */}
        {user && profile && (
          <View style={styles.menuContainer}>
            {menuSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.menuSection}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionItems}>
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={itemIndex}
                      style={styles.menuItem}
                      onPress={item.action}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={[COLORS.dark.card, COLORS.dark.surface]}
                        style={styles.menuItemGradient}
                      >
                        <View style={styles.menuItemContent}>
                          <View style={styles.menuItemLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                              <item.icon size={20} color={item.color} />
                            </View>
                            <Text style={styles.menuItemText}>{item.label}</Text>
                          </View>
                          <Text style={styles.menuItemArrow}>›</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>TradeHub v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>
            Marketplace Africain Francophone
          </Text>
        </View>

        <View style={styles.bottomPadding} />
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
  title: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  userInfoContainer: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
  },
  userInfoGradient: {
    flexDirection: 'row',
    padding: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: SIZES.md,
    borderWidth: 2,
    borderColor: COLORS.neon.blue + '50',
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  userTypeContainer: {
    alignSelf: 'flex-start',
    marginBottom: SIZES.xs,
  },
  userTypeBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.sm,
  },
  userTypeText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  userLocation: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  guestContainer: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
  },
  guestGradient: {
    padding: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    alignItems: 'center',
  },
  guestIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.neon.blue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  guestTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  guestSubtitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  loginButton: {
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  loginGradient: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  loginText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  menuContainer: {
    paddingHorizontal: SIZES.md,
  },
  menuSection: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.md,
  },
  sectionItems: {
    gap: SIZES.sm,
  },
  menuItem: {
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  menuItemGradient: {
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  menuItemText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  menuItemArrow: {
    fontSize: SIZES.h3,
    color: COLORS.gray.light,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.xl,
  },
  appInfoText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.gray.light,
  },
  appInfoSubtext: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.medium,
    marginTop: SIZES.xs,
  },
  bottomPadding: {
    height: 100,
  },
});
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
import { MessageCircle, Search } from 'lucide-react-native';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface Conversation {
  id: string;
  supplierName: string;
  supplierAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productTitle: string;
}

export default function ConversationsScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    // Mock conversations for now
    const mockConversations: Conversation[] = [
      {
        id: '1',
        supplierName: 'Jean Doe Electronics',
        supplierAvatar: 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastMessage: 'Bonjour, êtes-vous intéressé par ce produit?',
        lastMessageTime: '15:30',
        unreadCount: 2,
        productTitle: 'iPhone 14 Pro Max'
      },
      {
        id: '2',
        supplierName: 'Marie Fashion Store',
        supplierAvatar: 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastMessage: 'Merci pour votre commande!',
        lastMessageTime: '12:45',
        unreadCount: 0,
        productTitle: 'Robe élégante'
      },
      {
        id: '3',
        supplierName: 'Tech Solutions',
        supplierAvatar: 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastMessage: 'Le produit est disponible en stock',
        lastMessageTime: 'Hier',
        unreadCount: 1,
        productTitle: 'Ordinateur portable'
      }
    ];
    
    setConversations(mockConversations);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  if (!user) {
    return (
      <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>Connectez-vous pour voir vos discussions</Text>
          <Text style={styles.emptyText}>
            Vous devez être connecté pour accéder à vos conversations avec les fournisseurs.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const renderConversation = (conversation: Conversation) => (
    <TouchableOpacity key={conversation.id} style={styles.conversationCard}>
      <LinearGradient
        colors={[COLORS.dark.card, COLORS.dark.surface]}
        style={styles.conversationGradient}
      >
        <View style={styles.conversationContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: conversation.supplierAvatar }}
              style={styles.supplierAvatar}
            />
            {conversation.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {conversation.unreadCount}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.conversationInfo}>
            <View style={styles.conversationHeader}>
              <Text style={styles.supplierName} numberOfLines={1}>
                {conversation.supplierName}
              </Text>
              <Text style={styles.messageTime}>
                {conversation.lastMessageTime}
              </Text>
            </View>
            
            <Text style={styles.productTitle} numberOfLines={1}>
              À propos de: {conversation.productTitle}
            </Text>
            
            <Text style={styles.lastMessage} numberOfLines={2}>
              {conversation.lastMessage}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discussions</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={COLORS.neon.blue} />
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      {conversations.length > 0 ? (
        <ScrollView 
          style={styles.conversationsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {conversations.map(renderConversation)}
          <View style={styles.bottomPadding} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>Aucune conversation</Text>
          <Text style={styles.emptyText}>
            Commencez à discuter avec des fournisseurs en cliquant sur "Discuter" 
            sur leurs produits ou profils.
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    paddingTop: SIZES.xxl,
  },
  title: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  searchButton: {
    padding: SIZES.sm,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.dark.card,
  },
  conversationsContainer: {
    flex: 1,
    paddingHorizontal: SIZES.md,
  },
  conversationCard: {
    marginBottom: SIZES.md,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  conversationGradient: {
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  conversationContent: {
    flexDirection: 'row',
    padding: SIZES.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SIZES.md,
  },
  supplierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.neon.pink,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  supplierName: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    flex: 1,
  },
  messageTime: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
  },
  productTitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.medium,
    color: COLORS.neon.blue,
    marginBottom: SIZES.xs,
  },
  lastMessage: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    lineHeight: 20,
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
    textAlign: 'center',
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
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Phone, MapPin, Home } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { AFRICAN_LOCATIONS } from '../../constants/locations';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'simple' | 'supplier'>('simple');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });

  const { signIn, signUp } = useAuth();

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.fullName || 
        !formData.phone || !formData.country || !formData.city || !formData.address) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        ...formData,
        userType,
      });

      if (userType === 'supplier') {
        Alert.alert(
          'Compte fournisseur créé!', 
          'Veuillez effectuer le paiement de 5USD au +234979401982 ou +243842578529'
        );
      } else {
        Alert.alert('Succès', 'Compte créé avec succès!');
      }
      
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur d\'inscription', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={COLORS.gradients.dark}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={COLORS.gradients.primary}
              style={styles.logo}
            >
              <Text style={styles.logoText}>TH</Text>
            </LinearGradient>
            <Text style={styles.title}>TradeHub</Text>
            <Text style={styles.subtitle}>
              {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
            </Text>
          </View>

          {/* User Type Selection for Registration */}
          {mode === 'register' && (
            <View style={styles.userTypeContainer}>
              <Text style={styles.sectionTitle}>Type de compte</Text>
              <View style={styles.userTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === 'simple' && styles.userTypeButtonActive
                  ]}
                  onPress={() => setUserType('simple')}
                >
                  <LinearGradient
                    colors={userType === 'simple' ? COLORS.gradients.primary : ['transparent', 'transparent']}
                    style={styles.userTypeGradient}
                  >
                    <User size={24} color={userType === 'simple' ? COLORS.white : COLORS.gray.light} />
                    <Text style={[
                      styles.userTypeText,
                      { color: userType === 'simple' ? COLORS.white : COLORS.gray.light }
                    ]}>
                      Utilisateur Simple
                    </Text>
                    <Text style={[
                      styles.userTypePrice,
                      { color: userType === 'simple' ? COLORS.neon.green : COLORS.gray.medium }
                    ]}>
                      Gratuit
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === 'supplier' && styles.userTypeButtonActive
                  ]}
                  onPress={() => setUserType('supplier')}
                >
                  <LinearGradient
                    colors={userType === 'supplier' ? COLORS.gradients.secondary : ['transparent', 'transparent']}
                    style={styles.userTypeGradient}
                  >
                    <Home size={24} color={userType === 'supplier' ? COLORS.white : COLORS.gray.light} />
                    <Text style={[
                      styles.userTypeText,
                      { color: userType === 'supplier' ? COLORS.white : COLORS.gray.light }
                    ]}>
                      Fournisseur
                    </Text>
                    <Text style={[
                      styles.userTypePrice,
                      { color: userType === 'supplier' ? COLORS.neon.orange : COLORS.gray.medium }
                    ]}>
                      5 USD
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {mode === 'register' && (
              <View style={styles.inputContainer}>
                <User size={20} color={COLORS.neon.blue} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom complet"
                  placeholderTextColor={COLORS.gray.medium}
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                />
              </View>
            )}

            {mode === 'register' && (
              <View style={styles.inputContainer}>
                <Phone size={20} color={COLORS.neon.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Numéro de téléphone"
                  placeholderTextColor={COLORS.gray.medium}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Mail size={20} color={COLORS.neon.purple} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.gray.medium}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={COLORS.neon.pink} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={COLORS.gray.medium}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />
            </View>

            {mode === 'register' && (
              <>
                <View style={styles.locationContainer}>
                  <View style={styles.pickerContainer}>
                    <MapPin size={20} color={COLORS.neon.orange} style={styles.inputIcon} />
                    <Picker
                      selectedValue={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value, city: '' })}
                      style={styles.picker}
                    >
                      <Picker.Item label="Sélectionner un pays" value="" />
                      {Object.keys(AFRICAN_LOCATIONS).map((country) => (
                        <Picker.Item key={country} label={country} value={country} />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.pickerContainer}>
                    <MapPin size={20} color={COLORS.neon.yellow} style={styles.inputIcon} />
                    <Picker
                      selectedValue={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                      style={styles.picker}
                      enabled={!!formData.country}
                    >
                      <Picker.Item label="Sélectionner une ville" value="" />
                      {(AFRICAN_LOCATIONS[formData.country as keyof typeof AFRICAN_LOCATIONS] || []).map((city) => (
                        <Picker.Item key={city} label={city} value={city} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Home size={20} color={COLORS.neon.green} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Adresse complète"
                    placeholderTextColor={COLORS.gray.medium}
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    multiline
                  />
                </View>
              </>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={COLORS.gradients.primary}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>
                  {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Switch Mode */}
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              <Text style={styles.switchText}>
                {mode === 'login'
                  ? 'Pas de compte? S\'inscrire'
                  : 'Déjà un compte? Se connecter'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.md,
  },
  header: {
    alignItems: 'center',
    marginTop: SIZES.xxl,
    marginBottom: SIZES.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
    shadowColor: COLORS.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  logoText: {
    fontSize: 32,
    fontFamily: FONTS.black,
    color: COLORS.white,
  },
  title: {
    fontSize: SIZES.h1,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
    textShadowColor: COLORS.neon.blue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.gray.light,
    textAlign: 'center',
  },
  userTypeContainer: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginBottom: SIZES.md,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  userTypeButton: {
    flex: 1,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    overflow: 'hidden',
  },
  userTypeButtonActive: {
    borderColor: COLORS.neon.blue,
    shadowColor: COLORS.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  userTypeGradient: {
    padding: SIZES.md,
    alignItems: 'center',
  },
  userTypeText: {
    fontSize: SIZES.h6,
    fontFamily: FONTS.medium,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  userTypePrice: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.regular,
    marginTop: SIZES.xs,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dark.card,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  inputIcon: {
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.white,
  },
  locationContainer: {
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dark.card,
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  picker: {
    flex: 1,
    height: 50,
    color: COLORS.white,
  },
  submitButton: {
    marginTop: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
    shadowColor: COLORS.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  submitGradient: {
    paddingVertical: SIZES.md,
    alignItems: 'center',
  },
  submitText: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  switchButton: {
    marginTop: SIZES.lg,
    alignItems: 'center',
  },
  switchText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.neon.blue,
  },
});
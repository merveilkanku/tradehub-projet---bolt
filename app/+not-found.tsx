import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <LinearGradient colors={COLORS.gradients.dark} style={styles.container}>
        <Text style={styles.title}>Cette page n'existe pas.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retourner à l'accueil!</Text>
        </Link>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.md,
  },
  title: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.lg,
  },
  link: {
    marginTop: SIZES.md,
    paddingVertical: SIZES.md,
  },
  linkText: {
    fontSize: SIZES.body,
    color: COLORS.neon.blue,
    fontFamily: FONTS.medium,
  },
});
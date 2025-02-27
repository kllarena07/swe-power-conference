import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/context/AuthContext';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

type SplashScreenProps = {
  onInitializationComplete: () => void;
};

const AppSplashScreen = ({ onInitializationComplete }: SplashScreenProps) => {
  const { user } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to allow auth state to be determined
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the app that initialization is complete
        setIsAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    // Only hide the splash screen when both:
    // 1. The app is ready (resources loaded, etc)
    // 2. Auth state is determined (user is either null or defined, not undefined)
    if (isAppReady && user !== undefined) {
      // We know the auth state, so we can hide the splash screen and notify parent
      SplashScreen.hideAsync();
      onInitializationComplete();
    }
  }, [isAppReady, user, onInitializationComplete]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/powerappicons/splash-screen.png')}
        style={styles.image}
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9A598A" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
      <View style={styles.footer}>
        <MaterialCommunityIcons 
          name="star-four-points" 
          size={20} 
          color="#C3A0D7" 
        />
        <Text style={styles.footerText}>POWER Conference</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#9A598A',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    color: '#8F9BB3',
    fontWeight: '500',
  }
});

export default AppSplashScreen;


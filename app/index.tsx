import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.logoSection}>
        
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Ionicons name="headset" size={80} color="#fff" />
            <View style={styles.pinBadge}>
              <Ionicons name="location" size={24} color="#4CAF50" />
            </View>
          </View>
        </View>

        <Text style={styles.appName}>Sessiz Ortam</Text>
        <Text style={styles.appTagline}>Bulucu</Text>
        
        <Text style={styles.description}>
          Gürültüden uzaklaş, kendine odaklan.{'\n'}Sessiz mekanları keşfetmenin en kolay yolu.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() => router.push('/login')} 
        >
          <Text style={styles.btnText}>Keşfetmeye Başla</Text>
          <View style={styles.btnIcon}>
            <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  outerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#fff',
  },
  pinBadge: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 32,
    fontWeight: '300',
    color: '#fff',
    marginTop: -5,
    marginBottom: 20,
  },
  description: {
    color: '#E8F5E9',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    maxWidth: '80%',
  },
  footer: {
    padding: 50,
    paddingBottom: Platform.OS === 'ios' ? 50 : 80,
  },
  startButton: {
    backgroundColor: '#fff',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  btnText: {
    color: '#2E7D32',
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
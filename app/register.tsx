import { auth, db } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !fullName || !username) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Güvenlik', 'Şifre en az 6 karakter olmalı.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        username: username.startsWith('@') ? username : '@' + username,
        email: email,
        createdAt: serverTimestamp(),
        avatarUrl: null,
        role: 'user'
      });

      Alert.alert('Başarılı', 'Hesabınız oluşturuldu! Aramıza hoş geldiniz.');
      router.replace('/(tabs)/map'); 
      
    } catch (error: any) {
      console.error(error);
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') msg = 'Bu e-posta zaten kullanılıyor.';
      Alert.alert('Kayıt Hatası', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#388E3C" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Kayıt Ol</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="at" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                placeholder="Kullanıcı Adı (örn: arda123)" 
                style={styles.input} 
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                placeholder="Ad Soyad" 
                style={styles.input} 
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                placeholder="E-posta" 
                keyboardType="email-address" 
                autoCapitalize="none"
                style={styles.input} 
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                placeholder="Şifre" 
                secureTextEntry 
                style={styles.input} 
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                placeholder="Şifre Tekrar" 
                secureTextEntry 
                style={styles.input} 
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
              />
            </View>

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#388E3C' },
  formContainer: { gap: 15, marginTop: 20 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', 
    borderRadius: 12, paddingHorizontal: 15, height: 55, backgroundColor: '#FAFAFA'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  registerButton: { 
    backgroundColor: '#4CAF50', height: 55, borderRadius: 12, justifyContent: 'center', 
    alignItems: 'center', marginTop: 10, elevation: 5
  },
  registerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 30 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 15 }
});
import { auth, db, storage } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFullName(data.fullName || '');
        setUsername(data.username || '');
        setAvatarUrl(data.avatarUrl || null);
      }
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf yüklemek için galeri izni vermelisiniz.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", user.uid), {
        avatarUrl: downloadUrl
      });

      setAvatarUrl(downloadUrl);
      Alert.alert("Harika", "Profil fotoğrafın güncellendi! 🎉");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Hata", "Fotoğraf yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        username: username.startsWith('@') ? username : '@' + username
      });
      await updateProfile(user, { displayName: fullName });
      Alert.alert("Başarılı", "Bilgilerin güncellendi.");
    } catch (error) {
      Alert.alert("Hata", "Bilgiler kaydedilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || newPassword.length < 6) {
      Alert.alert("Hata", "Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      Alert.alert("Başarılı", "Şifreniz değiştirildi. Lütfen tekrar giriş yapın.");
      setNewPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert("Güvenlik", "Şifre değiştirmek için lütfen çıkış yapıp tekrar giriş yapın.");
      } else {
        Alert.alert("Hata", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profili Düzenle</Text>
          <View style={{width:24}} /> 
        </View>

        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, {backgroundColor:'#E8F5E9', justifyContent:'center', alignItems:'center'}]}>
                <Ionicons name="camera" size={40} color="#4CAF50" />
              </View>
            )}
            <View style={styles.editIconBadge}>
              <Ionicons name="pencil" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput 
            style={styles.input} 
            value={fullName} 
            onChangeText={setFullName} 
          />

          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput 
            style={styles.input} 
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Bilgileri Kaydet</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.passwordSection}>
          <Text style={styles.sectionTitle}>Güvenlik</Text>
          
          <Text style={styles.label}>Yeni Şifre</Text>
          <TextInput 
            style={styles.input} 
            placeholder="******" 
            secureTextEntry 
            value={newPassword}
            onChangeText={setNewPassword}
          />
          
          <TouchableOpacity style={[styles.saveButton, {backgroundColor:'#FF9800'}]} onPress={handleChangePassword}>
            <Text style={styles.saveBtnText}>Şifreyi Güncelle</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0' },
  editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4CAF50', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  changePhotoText: { marginTop: 10, color: '#4CAF50', fontWeight: 'bold' },
  formSection: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight:'600' },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, backgroundColor: '#FAFAFA' },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  passwordSection: {},
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color:'#333' },
});
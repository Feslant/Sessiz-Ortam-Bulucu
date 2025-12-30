import { auth, db } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("Kullanıcı profili henüz oluşmamış.");
      }
      setLoading(false); 
    }, (error) => {
      console.error("Profil hatası:", error);
      setLoading(false);
    });

    const favQuery = query(collection(db, "users", currentUser.uid, "favorites"));
    const unsubscribeFavs = onSnapshot(favQuery, (snapshot) => {
      const favList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFavorites(favList);
    });

    return () => {
      unsubscribeUser();
      unsubscribeFavs();
    };
  }, []);

  const handleLogout = async () => {
    Alert.alert("Çıkış Yap", "Emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Çıkış", style: "destructive", onPress: async () => { await signOut(auth); router.replace('/login'); } }
    ]);
  };

  const goToDetail = (placeId: string) => {
    router.push({ pathname: "/place-detail", params: { id: placeId } });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {userData?.avatarUrl ? (
              <Image source={{ uri: userData.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitials}>
                {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "?"}
              </Text>
            )}
          </View>
          <Text style={styles.usernameText}>{userData?.username || "@kullanici"}</Text>
          <Text style={styles.fullNameText}>{userData?.fullName || "İsimsiz Kullanıcı"}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight:10}} />
            <Text style={styles.infoValue}>{userData?.email || auth.currentUser?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" style={{marginRight:10}} />
            <Text style={styles.infoValue}>
               Kayıt: {userData?.createdAt?.toDate ? new Date(userData.createdAt.toDate()).toLocaleDateString('tr-TR') : '...'}
            </Text>
          </View>
        </View>

        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>Favori Mekanlarım ({favorites.length})</Text>
          
          {favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-dislike-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>Henüz favori mekanın yok.</Text>
            </View>
          ) : (
            favorites.map((fav) => (
              <TouchableOpacity key={fav.id} style={styles.favItem} onPress={() => goToDetail(fav.placeId)}>
                <View style={styles.favIconBox}>
                  <Ionicons name="heart" size={20} color="#D32F2F" />
                </View>
                <View style={{flex:1}}>
                  <Text style={styles.favTitle}>{fav.title}</Text>
                  <Text style={styles.favCategory}>{fav.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  avatarContainer: { alignItems: 'center', marginBottom: 25 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: '#4CAF50', overflow:'hidden' },
  avatarInitials: { fontSize: 36, fontWeight: 'bold', color: '#4CAF50' },
  avatarImage: { width: '100%', height: '100%' },
  usernameText: { fontSize: 16, color: '#666', marginBottom: 2 },
  fullNameText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  infoCard: { backgroundColor: '#FAFAFA', borderRadius: 15, padding: 15, marginBottom: 25, borderWidth: 1, borderColor: '#EEE' },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 15, color: '#444' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  favoritesSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  favItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 },
  favIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  favTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  favCategory: { fontSize: 13, color: '#888' },
  emptyState: { alignItems: 'center', padding: 20, opacity: 0.6 },
  emptyText: { marginTop: 10, color: '#999' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 30, backgroundColor: '#FFEBEE', width: '100%' },
  logoutText: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold' },
});
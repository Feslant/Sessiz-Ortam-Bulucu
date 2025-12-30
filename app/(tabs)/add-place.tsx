import { auth, db } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function AddPlaceScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Konum izni reddedildi. Yer eklemek için izin vermelisiniz.');
        setGpsLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });
      } catch (error) {
        setErrorMsg('Konum alınamadı. GPS açık mı?');
      } finally {
        setGpsLoading(false);
      }
    })();
  }, []);

  const handleSavePlace = async () => {
    if (!auth.currentUser) {
      Alert.alert('Hata', 'Giriş yapmalısınız.');
      return;
    }
    if (!location) {
      Alert.alert('Konum Hatası', 'Cihaz konumu henüz alınamadı. Lütfen bekleyin.');
      return;
    }
    if (!title || !selectedCategory) {
      Alert.alert('Eksik Bilgi', 'Lütfen yer adı ve kategori seçiniz.');
      return;
    }

    setLoading(true);
    try {
      const placeData = {
        title: title,
        address: address || 'Adres girilmedi',
        category: selectedCategory,
        description: description,
        location: location,
        addedBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        rating: 0,
      };

      await addDoc(collection(db, 'places'), placeData);

      Alert.alert('Harika!', 'Mekan başarıyla haritaya eklendi.');

      setTitle('');
      setAddress('');
      setDescription('');
      setSelectedCategory(null);
      router.push('/(tabs)/map');
    } catch (error: any) {
      console.error('Kayıt hatası: ', error);
      Alert.alert('Hata', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Yer Ekle</Text>
          </View>

          <View style={[styles.locationCard, errorMsg ? styles.errorCard : null]}>
            <Ionicons
              name={errorMsg ? 'alert-circle' : 'location'}
              size={40}
              color={errorMsg ? '#D32F2F' : '#4CAF50'}
            />

            <Text style={styles.locationTitle}>
              {errorMsg ? 'Konum Alınamadı' : 'Mevcut Konumun'}
            </Text>

            {gpsLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <Text style={{ marginLeft: 10, color: '#666' }}>GPS aranıyor...</Text>
              </View>
            ) : location ? (
              <View style={styles.locationBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.locationBadgeText}>
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
              </View>
            ) : (
              <Text style={{ color: '#D32F2F', marginTop: 5 }}>{errorMsg}</Text>
            )}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Yer Adı *</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Çalışma Salonu"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Adres (İsteğe Bağlı)</Text>
            <TextInput
              style={styles.input}
              placeholder="Mahalle, cadde vb."
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Yer Türü *</Text>
            <View style={styles.categoryContainer}>
              {['Kütüphane', 'Kafe', 'Park', 'Çalışma Odası', 'Diğer'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat && styles.categoryTextActive
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Notlar..."
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!location || gpsLoading) && { backgroundColor: '#ccc' }
              ]}
              onPress={handleSavePlace}
              disabled={loading || gpsLoading || !location}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Yeri Ekle</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32' },

  locationCard: {
    backgroundColor: '#F1F8E9',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  errorCard: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
  locationTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 10 },
  locationBadge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  locationBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  form: { gap: 15 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#388E3C', marginTop: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FAFAFA'
  },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    backgroundColor: '#fff'
  },
  categoryButtonActive: { backgroundColor: '#4CAF50' },
  categoryText: { color: '#4CAF50', fontWeight: 'bold' },
  categoryTextActive: { color: '#fff' },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

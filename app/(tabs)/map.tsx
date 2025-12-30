import { db } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [showTraffic, setShowTraffic] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'places'), (snapshot) => {
      const placesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlaces(placesList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  const handleCardPress = () => {
    if (selectedPlace) {
      router.push({
        pathname: '/place-detail',
        params: { id: selectedPlace.id }
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons name="location-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.headerTitle}>Sessiz Alanlar</Text>
        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.whiteCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="map-outline" size={40} color="#4CAF50" />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.cardTitle}>
                {selectedPlace ? selectedPlace.title : 'Keşfet'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {showTraffic ? '🔴 Canlı Yoğunluk Katmanı Açık' : '🟢 Sadece Sessiz Mekanlar'}
              </Text>
            </View>
          </View>

          <View style={styles.mapBoxContainer}>
            <MapView
              style={styles.map}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showsTraffic={showTraffic}
              showsBuildings={!showTraffic}
              onPress={() => setSelectedPlace(null)}
              initialRegion={{
                latitude: userLocation?.latitude || 38.4945,
                longitude: userLocation?.longitude || 27.7032,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              {places.map((place) => (
                <Marker
                  key={place.id}
                  coordinate={{
                    latitude: place.location.latitude,
                    longitude: place.location.longitude,
                  }}
                  title={place.title}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedPlace(place);
                  }}
                >
                  <View style={styles.customMarker}>
                    <Ionicons
                      name="location"
                      size={35}
                      color={selectedPlace?.id === place.id ? '#D32F2F' : '#4CAF50'}
                    />
                  </View>
                </Marker>
              ))}
            </MapView>

            {loading && (
              <ActivityIndicator
                style={styles.mapLoading}
                size="large"
                color="#4CAF50"
              />
            )}

            <TouchableOpacity
              style={[styles.layerButton, showTraffic && styles.layerButtonActive]}
              onPress={() => setShowTraffic(!showTraffic)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="layers"
                size={24}
                color={showTraffic ? '#fff' : '#666'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.infoContainer}
            onPress={handleCardPress}
            activeOpacity={selectedPlace ? 0.7 : 1}
          >
            {selectedPlace ? (
              <>
                <View style={styles.locationRow}>
                  <Ionicons name="storefront-outline" size={18} color="#4CAF50" />
                  <Text style={styles.locationText}>{selectedPlace.category}</Text>
                </View>
                <Text style={styles.infoDesc} numberOfLines={2}>
                  {selectedPlace.address}
                  {'\n'}
                  <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                    Detaylar için tıklayın 👉
                  </Text>
                </Text>
              </>
            ) : (
              <>
                <View style={styles.locationRow}>
                  <Ionicons
                    name={showTraffic ? 'car-sport' : 'leaf'}
                    size={18}
                    color={showTraffic ? '#FF9800' : '#4CAF50'}
                  />
                  <Text style={styles.locationText}>
                    {showTraffic ? 'Canlı Yoğunluk Gösteriliyor' : 'Sessiz Mod'}
                  </Text>
                </View>
                <Text style={styles.infoDesc}>
                  {showTraffic
                    ? 'Kırmızı çizgiler gürültülü (yoğun), yeşil çizgiler sessiz (sakin) bölgeleri gösterir.'
                    : 'Haritadaki yeşil pinlere tıklayarak kullanıcıların eklediği sessiz mekanları görebilirsiniz.'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#4CAF50' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 45 : 15,
    backgroundColor: '#4CAF50',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  mainContainer: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },

  whiteCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8
  },

  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },

  mapBoxContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 15,
    position: 'relative'
  },
  map: { width: '100%', height: '100%' },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)'
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5
  },

  layerButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10
  },
  layerButtonActive: {
    backgroundColor: '#2E7D32',
  },

  infoContainer: { alignItems: 'center', width: '100%', paddingVertical: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  locationText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 5 },
  infoDesc: { textAlign: 'center', color: '#666', fontSize: 14, lineHeight: 20 },
});

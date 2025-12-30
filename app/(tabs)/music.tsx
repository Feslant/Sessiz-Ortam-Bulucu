import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const PLAYLISTS = {
  'Klasik': [
    {
      id: '1',
      title: 'Valse',
      artist: 'Evgeny Grinko',
      image: 'https://i.scdn.co/image/ab67616d00001e02192fb737c6faf1680fb5ed04',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FEvgeny-Grinko-Valse.mp3?alt=media&token=4d511625-9c85-4d63-a138-5d14f1a989b7', 
    },
    {
      id: '2',
      title: 'Do You Remember',
      artist: 'Mark Eliyahu',
      image: 'https://static.ticimax.cloud/cdn-cgi/image/width=370,quality=85/33320/uploads/urunresimleri/buyuk/phil-collins-but-seriously-a886-7.jpg',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FMark-Eliyahu-Do-You-Remember.mp3?alt=media&token=68febd9f-2a3f-44bf-b52a-7da7131791b1', 
    },
    {
      id: '3',
      title: 'Carmen: Habanera',
      artist: 'France Orchestre',
      image: 'https://i.ytimg.com/vi/K7BE7trV_oQ/maxresdefault.jpg',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FJessye_Norman_Choeurs_de_Radio_France_Orchestre_National_De_France_Seiji_Ozawa_-_Mais_nous_ne_vo_(mp3.pm).mp3?alt=media&token=914eabf1-d3e4-4af0-9564-a95c6b4c0285', 
    },
    {
      id: '4',
      title: 'Drops',
      artist: 'Mark Eliyahu',
      image: 'https://i.ytimg.com/vi/tQOjrgfIYxo/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGMgYyhjMA8=&rs=AOn4CLC8I9wZWOI8KEow64dKDPLktqKpNw',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FMark-Eliyahu-Drops.mp3?alt=media&token=9a217f11-9c5e-4e30-9b2b-b1318c47e66c', 
    },
    {
      id: '5',
      title: 'Journey',
      artist: 'Mark Eliyahu',
      image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=1000&auto=format&fit=crop',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FMark-Eliyahu-Journey.mp3?alt=media&token=c3cfbb90-41f9-47d9-826d-0a5191a1fd3d', 
    }
  ],
  'Pop': [
    {
      id: 'L1',
      title: 'Çati Kati',
      artist: 'Gokhan Turkmen',
      image: 'https://i.ytimg.com/vi/_twM8OV310Q/maxresdefault.jpg',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FPop%2FGokhan%20Turkmen%20Cati%20Kati-Canli.mp3?alt=media&token=32d1f492-34e9-429b-9209-64656be0839f',
    },
    {
      id: 'L2',
      title: 'Sen Istanbulsun',
      artist: 'Gokhan Turkmen',
      image: 'https://i.ytimg.com/vi/DDgswnI2AbA/maxresdefault.jpg',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FPop%2FGokhan%20Turkmen%20Sen%20Istanbulsun.mp3?alt=media&token=ac8d5165-808b-4e57-8da0-fe4b13e143dc', 
    },
    {
      id: 'L3',
      title: 'Gel',
      artist: 'Mabel Matiz',
      image: 'https://i.ytimg.com/vi/eZ5p-QNIECE/maxresdefault.jpg',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FPop%2FMabel%20Matiz%20Gel.mp3?alt=media&token=1efed353-03f3-4065-ae6a-7b605ae530b6',
    },
    {
      id: 'L4',
      title: 'Oncel Beni Hatirla',
      artist: 'Nazan',
      image: 'https://i.scdn.co/image/ab67616d0000b2734990484479f8db06d1b84f02',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FPop%2FNazan-Oncel%20Beni%20Hatirla.mp3?alt=media&token=fa73fd67-43dc-4b33-8f5d-75c6835d3c1c',
    },
    {
      id: 'L5',
      title: 'Son Arzum',
      artist: 'skapova',
      image: 'https://i.ytimg.com/vi/qqy-fVp97o4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDCKr_7xSxtvvOlFvX_UPckiQ7WEw',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FPop%2Fskapova%20son%20arzum.mp3?alt=media&token=a2315163-82d0-4dae-a3e3-8d33aad21c95',
    },
  ],
  'Doğa': [
    {
      id: 'D1',
      title: 'Alev Ates Sesi',
      artist: 'Doğa',
      image: 'https://images.pexels.com/photos/10842312/pexels-photo-10842312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FDo%C4%9Fa%20Sesi%2FAlev%20Ates%20Sesi.mp3?alt=media&token=bc0db726-45e9-4aa5-b1fa-41782b844d81', 
    },
    {
      id: 'D2',
      title: 'Dogal Kus Sesi',
      artist: 'Kuş Sesi',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMIo0IjWu3mxR_SZJZO-megzKysF3Wvo8qpA&s',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FDo%C4%9Fa%20Sesi%2FDogal%20Kus%20Sesi.mp3?alt=media&token=079c0666-e3ad-485d-9f0f-68dc97a73a28',
    },
    {
      id: 'D3',
      title: 'Gok Gurultulu Saganak Yagmur Sesi',
      artist: 'Doğa',
      image: 'https://i.ytimg.com/vi/NTstGcSxwjI/sddefault.jpg?sqp=-oaymwEmCIAFEOAD8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEQgRChlMA8=&rs=AOn4CLCVU2pEgBBhS6pQoFUBNPjWzYYY4A',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FDo%C4%9Fa%20Sesi%2FGok%20Gurultulu%20Saganak%20Yagmur%20Sesi.mp3?alt=media&token=9c47a970-8005-4ab8-b41c-8a807e1b6cda', 
    },
    {
      id: 'D4',
      title: 'Irmak Su Sesi',
      artist: 'Doğa',
      image: 'https://i.ytimg.com/vi/szXYRCAGsEc/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgWChDMA8=&rs=AOn4CLBVJ7W6SgElfwR87D77D7k1capw5w',
      uri: 'https://firebasestorage.googleapis.com/v0/b/sessizortamapp.firebasestorage.app/o/music%2FDo%C4%9Fa%20Sesi%2FIrmak%20Su%20Sesi.mp3?alt=media&token=2604b3aa-0d40-4663-8055-b09143c8fa0e', 
    },
  ]
};

export default function MusicScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Klasik' | 'Pop' | 'Doğa'>('Klasik');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.warn("Ses ayarları yüklenemedi:", e);
      }
    };
    setupAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlaySound = async (category: string, index: number) => {
    if (sound) {
      await sound.unloadAsync();
    }

    setLoading(true);
    
    const trackList = PLAYLISTS[category as keyof typeof PLAYLISTS];
    if (!trackList || !trackList[index]) {
      setLoading(false);
      return;
    }

    const track = trackList[index];

    if (!track.uri || track.uri.startsWith('gs://') || track.uri === 'BURAYA_YAPISTIR') {
        Alert.alert("Link Hatası", "Bu şarkı için geçerli bir indirme linki (https) girilmemiş. Lütfen Firebase'den 'Download URL'i kopyalayın.");
        setLoading(false);
        return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);
      
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
           handleNext();
        }
      });

    } catch (error) {
      console.error("Müzik hatası:", error);
      Alert.alert("Hata", "Bu şarkı şu an çalınamıyor. Linki kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      loadAndPlaySound(activeCategory, currentIndex);
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const trackList = PLAYLISTS[activeCategory];
    const nextIndex = currentIndex < trackList.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    loadAndPlaySound(activeCategory, nextIndex);
  };

  const handlePrev = () => {
    const trackList = PLAYLISTS[activeCategory];
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : trackList.length - 1;
    setCurrentIndex(prevIndex);
    loadAndPlaySound(activeCategory, prevIndex);
  };

  const handleCategorySelect = (cat: 'Klasik' | 'Pop' | 'Doğa') => {
    if (activeCategory !== cat) {
      setActiveCategory(cat);
      setCurrentIndex(0);
      loadAndPlaySound(cat, 0);
    }
  };

  const currentTrack = PLAYLISTS[activeCategory][currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Odaklanma Modu 🎧</Text>
      </View>

      <View style={styles.albumContainer}>
        <View style={[styles.albumWrapper, isPlaying && styles.albumPlaying]}>
          <Image source={{ uri: currentTrack.image }} style={styles.albumArt} />
        </View>
        <View style={styles.trackInfo}>
          <Text style={styles.songTitle}>{currentTrack.title}</Text>
          <Text style={styles.artistName}>{currentTrack.artist}</Text>
          <Text style={styles.queueInfo}>
            {currentIndex + 1} / {PLAYLISTS[activeCategory].length}
          </Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={handlePrev}>
          <Ionicons name="play-skip-back" size={40} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={45} 
              color="#fff" 
              style={{ marginLeft: isPlaying ? 0 : 5 }} 
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="play-skip-forward" size={40} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Listeler</Text>
        <View style={styles.categoryList}>
          {(['Klasik', 'Pop', 'Doğa'] as const).map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[
                styles.catButton, 
                activeCategory === cat && styles.catButtonActive
              ]} 
              onPress={() => handleCategorySelect(cat)}
            >
              <Ionicons 
                name={cat === 'Doğa' ? 'leaf' : cat === 'Klasik' ? 'musical-notes' : 'headset'} 
                size={22} 
                color={activeCategory === cat ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.catText, 
                activeCategory === cat && styles.catTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'space-evenly' },
  header: { alignItems: 'center', marginTop: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32' },
  albumContainer: { alignItems: 'center', marginTop: 10 },
  albumWrapper: { width: width * 0.75, height: width * 0.75, borderRadius: 20, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, backgroundColor: '#fff', padding: 5 },
  albumPlaying: { shadowColor: '#4CAF50', shadowOpacity: 0.5, elevation: 25 },
  albumArt: { width: '100%', height: '100%', borderRadius: 15 },
  trackInfo: { alignItems: 'center', marginTop: 25 },
  songTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', paddingHorizontal: 20 },
  artistName: { fontSize: 16, color: '#666', marginTop: 5, fontWeight: '500' },
  queueInfo: { fontSize: 12, color: '#999', marginTop: 5, fontWeight: 'bold' },
  controlsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, marginTop: 10 },
  playButton: { width: 85, height: 85, backgroundColor: '#4CAF50', borderRadius: 45, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4 },
  categoryContainer: { paddingHorizontal: 20, marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  categoryList: { flexDirection: 'row', justifyContent: 'space-between' },
  catButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', width: 100, height: 80, borderRadius: 18, gap: 5 },
  catButtonActive: { backgroundColor: '#4CAF50' },
  catText: { fontSize: 13, color: '#666', fontWeight: '600' },
  catTextActive: { color: '#fff' },
});
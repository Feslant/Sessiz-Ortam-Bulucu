import { auth, db } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Linking, Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PlaceDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const placeId = params.id as string;

  const [placeData, setPlaceData] = useState<any>(params);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    if (!placeId) return;

    const unsubPlace = onSnapshot(doc(db, "places", placeId), (docSnap) => {
      if (docSnap.exists()) {
        setPlaceData({ id: docSnap.id, ...docSnap.data() });
      }
    });

    let unsubFav = () => {};
    if (auth.currentUser) {
      const favRef = doc(db, "users", auth.currentUser.uid, "favorites", placeId);
      unsubFav = onSnapshot(favRef, (docSnap) => setIsFavorite(docSnap.exists()));
    }

    const commentsRef = collection(db, "places", placeId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const unsubComments = onSnapshot(q, (snapshot) => {
      const cList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(cList);
    });

    return () => {
      unsubPlace();
      unsubFav();
      unsubComments();
    };
  }, [placeId]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    if (!auth.currentUser) {
        Alert.alert("Giriş Yap", "Yorum yapmak için giriş yapın.");
        return;
    }

    setSendingComment(true);
    try {
        await addDoc(collection(db, "places", placeId, "comments"), {
            text: newComment,
            userId: auth.currentUser.uid,
            username: auth.currentUser.displayName || "@gizli",
            createdAt: serverTimestamp()
        });
        setNewComment('');
    } catch (error) {
        Alert.alert("Hata", "Yorum gönderilemedi.");
    } finally {
        setSendingComment(false);
    }
  };

  const openMapsReal = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${placeData.latitude},${placeData.longitude}`;
    const label = placeData.title;
    const url = Platform.select({ ios: `${scheme}${label}@${latLng}`, android: `${scheme}${latLng}(${label})` });
    if (url) Linking.openURL(url);
  };

  const toggleFavorite = async () => {
    if (!auth.currentUser) return Alert.alert("Hata", "Giriş yapın.");
    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", placeId);
    if (isFavorite) await deleteDoc(favRef);
    else await setDoc(favRef, { placeId, title: placeData.title, address: placeData.address || "", category: placeData.category || "Genel" });
  };

  const handleShare = async () => {
    await Share.share({ message: `Sessiz Ortam Bulucu: ${placeData.title} \n📍 ${placeData.address}` });
  };

  const handleVote = async (type: string, label: string) => {
    if (!auth.currentUser) return Alert.alert("Hata", "Giriş yapın.");
    Alert.alert("Oylandı", label);
    await updateDoc(doc(db, "places", placeId), { [type]: increment(1), totalVotes: increment(1) });
  };

  const handleCheckIn = async () => {
    if (!auth.currentUser) return Alert.alert("Hata", "Giriş yapın.");
    setLoading(true);
    try {
        await updateDoc(doc(db, "places", placeId), { checkins: increment(1) });
        Alert.alert("Check-in", "Başarılı! 📍");
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.imageHeader}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1000&auto=format&fit=crop' }} style={styles.headerImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
            <Text style={styles.title}>{placeData.title}</Text>
            <Text style={styles.address}>{placeData.address}</Text>

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={openMapsReal}><Ionicons name="navigate" size={24} color="#1976D2" /><Text>Yol Tarifi</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}><Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="#D32F2F" /><Text>Favorile</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}><Ionicons name="share-social-outline" size={24} color="#388E3C" /><Text>Paylaş</Text></TouchableOpacity>
            </View>

            <View style={styles.votingSection}>
                <Text style={styles.sectionTitle}>Durum Nasıl?</Text>
                <View style={styles.voteButtons}>
                    <TouchableOpacity style={styles.voteBtn} onPress={() => handleVote('votesQuiet', 'Sessiz')}>
                        <Text>🤫 Sessiz ({placeData.votesQuiet || 0})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.voteBtn} onPress={() => handleVote('votesNoisy', 'Gürültülü')}>
                        <Text>📢 Gürültülü ({placeData.votesNoisy || 0})</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Yorumlar ({comments.length})</Text>
            
            <View style={styles.commentInputContainer}>
                <TextInput 
                    style={styles.commentInput} 
                    placeholder="Deneyimini paylaş..." 
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={handleSendComment} disabled={sendingComment}>
                    {sendingComment ? <ActivityIndicator color="#4CAF50" /> : <Ionicons name="send" size={24} color="#4CAF50" />}
                </TouchableOpacity>
            </View>

            {comments.map((c) => (
                <View key={c.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                        <Text style={styles.commentUser}>{c.username}</Text>
                        <Text style={styles.commentDate}>Bugün</Text> 
                    </View>
                    <Text style={styles.commentText}>{c.text}</Text>
                </View>
            ))}

            <View style={{height: 100}} /> 
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkinButton} onPress={handleCheckIn}>
            <Text style={styles.checkinText}>Buradayım! (Check-in) 📍</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1 },
  imageHeader: { height: 200, width: '100%' },
  headerImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor:'rgba(0,0,0,0.5)', borderRadius:20, padding:5 },
  body: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  address: { color: '#666', marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  actionButton: { alignItems: 'center', gap: 5 },
  votingSection: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginBottom: 20 },
  voteButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  voteBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color:'#333' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  commentInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 20, borderWidth:1, borderColor:'#EEE' },
  commentInput: { flex: 1, marginRight: 10 },
  commentItem: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  commentUser: { fontWeight: 'bold', color: '#4CAF50' },
  commentDate: { color: '#999', fontSize: 12 },
  commentText: { color: '#333' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#EEE' },
  checkinButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center' },
  checkinText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
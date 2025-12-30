import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCM6z0gju3sR5Bx246wtsm-gD1istuIz4c",
  authDomain: "sessizortamapp.firebaseapp.com",
  projectId: "sessizortamapp",
  storageBucket: "sessizortamapp.firebasestorage.app",
  messagingSenderId: "116189681032",
  appId: "1:116189681032:web:4833aa456debc002d0963d",
  measurementId: "G-PM4R7FW791"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true
});

export const storage = getStorage(app);
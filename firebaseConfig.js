// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDnfDXQcHDFzl1NGJP2TcBJ9_ZxMml_qW0",
    authDomain: "group1-df27a.firebaseapp.com",
    databaseURL: "https://group1-df27a-default-rtdb.firebaseio.com",
    projectId: "group1-df27a",
    storageBucket: "group1-df27a.appspot.com",
    messagingSenderId: "855361204578",
    appId: "1:855361204578:web:dac83d0a3e4c1317177c3b",
    measurementId: "G-6MY6VLJQR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});


export { app, auth, db, rtdb };
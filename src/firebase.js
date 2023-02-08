import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBL26o2L8YFHdJ-J6x6BS9_psyqE1BSD8k",
  authDomain: "beautyverse-87e3a.firebaseapp.com",
  projectId: "beautyverse-87e3a",
  storageBucket: "beautyverse-87e3a.appspot.com",
  messagingSenderId: "854934438439",
  appId: "1:854934438439:web:6351eda6dfa3004f85c402",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

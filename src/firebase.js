// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAI, getGenerativeModel, getImagenModel, GoogleAIBackend } from "firebase/ai";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSENGING_SENDERID,
  appId:process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case

export const firestore = getFirestore(app)
export const storage = getStorage(app);
export const auth = getAuth(app);
export const AIinit = getGenerativeModel(ai, { model: "gemini-2.5-flash-lite-preview-06-17" });
export const AiImage = getImagenModel(ai, { model: "imagen-4.0-generate-001" });
const analytics = getAnalytics(app);
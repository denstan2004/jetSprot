import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBWCqlPqE7Rb0c2N2WQCP7wEELIQ9WLOxU",
  authDomain: "sfy-firebase.firebaseapp.com",
  databaseURL: "https://sfy-firebase-default-rtdb.firebaseio.com",
  projectId: "sfy-firebase",
  storageBucket: "sfy-firebase.appspot.com",
  messagingSenderId: "10463238601",
  appId: "1:10463238601:web:c235650bc101a028b2f018",
  measurementId: "G-QDRTVSWCF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
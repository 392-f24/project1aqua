// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSv-cXRw7OW5SYgUjfX2dPpKJXZ9pT3hI",
  authDomain: "flashbrief-e6852.firebaseapp.com",
  projectId: "flashbrief-e6852",
  storageBucket: "flashbrief-e6852.appspot.com",
  messagingSenderId: "937682530177",
  appId: "1:937682530177:web:8d2cb4425e2d900a8ec280",
  measurementId: "G-JMMEW7DS99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
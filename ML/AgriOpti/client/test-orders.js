import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    // need to fetch firebase config from project
};

// ... actually I can just run a node script that uses firebase-admin or simply imports their firebase.js if I use ES modules.

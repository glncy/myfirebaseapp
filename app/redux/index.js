import * as key from '../config/constants';
import firebase from '@react-native-firebase/app';

export default function reducer(state = {}, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export function firebaseInit() {
    console.log('Init');
    console.log(!firebase.apps.length);
    if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: key.FIREBASE_API_KEY,
        authDomain: key.FIREBASE_AUTH_DOMAIN,
        databaseURL: key.FIREBASE_DATABASE_URL,
        storageBucket: key.FIREBASE_STORAGE_BUCKET,
        projectId: key.FIREBASE_PROJECT_ID,
        appId: key.FIREBASE_APP_ID,
        messagingSenderId: key.FIREBASE_MESSAGING_SENDER_ID,
    });
  }
}
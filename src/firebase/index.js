import * as firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import { getFirestore, collection } from 'firebase/firestore/lite';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCUMTZ2yOQgSxUXboZWe21RUjPIoIoSrV4",
    authDomain: "krg-map-6ff91.firebaseapp.com",
    projectId: "krg-map-6ff91",
    storageBucket: "krg-map-6ff91.appspot.com",
    messagingSenderId: "5115431126",
    appId: "1:5115431126:web:d58fd287f5603ac4f3a177"
};

const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);
const ticketsRef = collection(db, 'tickets');
const firebaseStorage = getStorage(app);

export {
    ticketsRef,
    firebaseStorage,
    app,
    db,
}

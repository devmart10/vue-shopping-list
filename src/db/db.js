import firebase from "firebase/app";
import "firebase/firestore";

// Get a Firestore instance
export const db = firebase.initializeApp({ projectId: "vue-grocery-list-da60d" }).firestore();

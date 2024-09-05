// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import config from "./config";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Function to fetch ParentID from the Firestore database
export async function getParentIds() {
  const usersCollectionRef = collection(db, "users"); // Adjust the collection path if different
  const querySnapshot = await getDocs(usersCollectionRef);
  const parentIds = [];
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data()); // This logs all data for each document
    if (doc.data().ParentID) { // Check if ParentID exists
      parentIds.push(doc.data().ParentID);
    }
  });

  return parentIds;
}

// Example usage
getParentIds().then(parentIds => {
  console.log("Parent IDs:", parentIds);
}).catch(error => {
  console.error("Error fetching parent IDs:", error);
});

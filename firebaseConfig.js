// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import config from "./config";


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

export async function getParentIds() {
  const usersCollectionRef = collection(db, "users"); 
  const querySnapshot = await getDocs(usersCollectionRef);
  const parentIds = [];
  querySnapshot.forEach((doc) => {
    if (doc.data().ParentID) { 
      parentIds.push(doc.data().ParentID);
    }
  });

  return parentIds;
}

function generateCode(length = 1) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to create invitation codes and store them in Firestore
export async function createInvitationCodes(numberOfCodes) {
  const codes = [];
  for (let i = 0; i < numberOfCodes; i++) {
    let newCode = generateCode();
    const codeRef = doc(db, "invitationCodes", newCode);

    // Check if the code already exists
    const docSnap = await getDoc(codeRef);
    if (!docSnap.exists()) {
      await setDoc(codeRef, { used: false });
      codes.push(newCode);
    } else {
      i--; // Decrement to retry generating a code if it already exists
    }
  }
  return codes;
}


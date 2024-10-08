import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
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

// Function to get Parents' phone numbers
export async function ParentsPhoneNumber() {
  const usersCollectionRef = collection(db, "users");
  const querySnapshot = await getDocs(usersCollectionRef);
  const phoneNumbers = [];

  querySnapshot.forEach((doc) => {
    if (doc.data().role === "Parent" && doc.data().phoneNumber) {
      phoneNumbers.push(doc.data().phoneNumber);
    }
  });

  return phoneNumbers;
}



export async function addUserFeedback(name, comment) {
  try {
    await addDoc(collection(db, "feedback"), {
      name: name,
      comment: comment,
      timestamp: new Date() // Optionally add a timestamp
    });
    console.log("Feedback successfully added.");
  } catch (error) {
    console.error("Error adding feedback: ", error);
    throw error;
  }
}

// function generateCode(length = 5) { 
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

// export async function createInvitationCodes(numberOfCodes) {
//   const codes = [];
//   for (let i = 0; i < numberOfCodes; i++) {
//     let newCode = generateCode();
//     const codeRef = doc(db, "invitationCodes", newCode);

//     const docSnap = await getDoc(codeRef);
//     if (!docSnap.exists()) {
//       await setDoc(codeRef, { used: false });
//       codes.push(newCode);
//     } else {
//       i--;
//     }
//   }
//   return codes;
// }


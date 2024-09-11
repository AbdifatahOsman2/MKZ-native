// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import config from "./config"; // Ensure this path is correct based on your project structure

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId
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

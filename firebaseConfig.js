import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Added missing imports

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
 
// Function to get Parent IDs
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

// Function to get Teacher IDs from Firestore
export async function getTeacherIds() {
  const usersCollectionRef = collection(db, "users");
  const querySnapshot = await getDocs(usersCollectionRef);
  const teacherIds = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.role === "Teacher" && data.TeacherID) {
      teacherIds.push(data.TeacherID);
    }
  });

  return teacherIds;
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


// Function to get Teacher Names from Firestore
export async function getTeacherNames() {
  const usersCollectionRef = collection(db, "users");
  const querySnapshot = await getDocs(usersCollectionRef);
  const teacherNames = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.role === "Teacher" && data.name) {
      teacherNames.push(data.name);
    }
  });

  return teacherNames;
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

// Generate invitation codes when the app is initialized
// async function generateAndLogCodes() {
//   const numberOfCodes = 10; // Define how many codes to generate
//   try {
//     const generatedCodes = await createInvitationCodes(numberOfCodes);
//     console.log("Generated Invitation Codes: ", generatedCodes);
//   } catch (error) {
//     console.error("Error generating codes: ", error);
//   }
// }

// // Call the function to generate codes on app start (or you can move this to an event)
// generateAndLogCodes();
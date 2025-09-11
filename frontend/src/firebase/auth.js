// Firebase Authentication utilities
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Sign up a new user
export const signUp = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, {
      displayName: userData.name
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: userData.name,
      email: user.email,
      school: userData.school,
      points: 0,
      badges: [],
      level: 1,
      createdAt: new Date(),
      lastLogin: new Date()
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in an existing user
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login time
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date()
    }, { merge: true });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out the current user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User document not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

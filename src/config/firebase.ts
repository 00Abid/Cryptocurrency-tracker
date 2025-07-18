import {initializeApp} from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWJOOTYOoQodjqxBqN_h2fGpOYpE5En7o",
  authDomain: "crypto-tracker-8a5c4.firebaseapp.com",
  projectId: "crypto-tracker-8a5c4",
  storageBucket: "crypto-tracker-8a5c4.firebasestorage.app",
  messagingSenderId: "59727721217",
  appId: "1:59727721217:web:5e18ef1d853122471be100",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({prompt: "select_account"});

/**
 * Google Sign-In
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Login Failed", error);
    return null;
  }
};

/**
 * Email & Password Sign-Up
 */
export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Set display name
    await updateProfile(user, {displayName: name});

    return {...user, displayName: name};
  } catch (error) {
    console.error("Sign-up Failed", error);
    throw error;
  }
};

/**
 * Email & Password Sign-In
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Refresh user data to ensure displayName is included
    await user.reload();

    return {...user, displayName: user.displayName || ""}; // Ensure displayName is not undefined
  } catch (error) {
    console.error("Sign-in Failed", error);
    throw error;
  }
};

/**
 * Authentication State Listener
 */
export const authListener = (setUser: (user: User | null) => void): void => {
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
};

/**
 * Log Out
 */
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Failed", error);
  }
};

export {auth};

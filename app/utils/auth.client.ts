import { type User } from "firebase/auth";
import { auth } from "~/utils/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Get the current authenticated user from Firebase Auth
 * @returns Promise<AuthUser | null>
 */
export const getCurrentUser = (): Promise<AuthUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Check if user is currently authenticated
 * @returns Promise<boolean>
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

/**
 * Get the current user's ID token
 * @returns Promise<string | null>
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
    }
  }
  return null;
};

/**
 * Convert Firebase User to AuthUser
 * @param user Firebase User object
 * @returns AuthUser
 */
export const serializeUser = (user: User): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

/**
 * Wait for auth to initialize and return the current user
 * @returns Promise<AuthUser | null>
 */
export const waitForAuth = (): Promise<AuthUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user ? serializeUser(user) : null);
    });
  });
};

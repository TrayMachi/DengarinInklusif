import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "~/utils/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Helper function to set the Firebase ID token as a cookie
const setAuthCookie = async (user: User | null) => {
  if (user) {
    try {
      const idToken = await user.getIdToken();
      // Set cookie that expires in 1 hour (same as Firebase token)
      document.cookie = `firebase-token=${idToken}; Path=/; SameSite=Strict; Max-Age=3600`;
    } catch (error) {
      console.error("Error setting auth cookie:", error);
    }
  } else {
    // Clear the cookie when user signs out
    document.cookie = `firebase-token=; Path=/; SameSite=Strict; Max-Age=0`;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenRefreshTimer = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing token refresh timer
  const clearTokenRefreshTimer = () => {
    if (tokenRefreshTimer.current) {
      clearInterval(tokenRefreshTimer.current);
      tokenRefreshTimer.current = null;
    }
  };

  // Set up token refresh timer
  const setupTokenRefresh = (user: User) => {
    clearTokenRefreshTimer();

    // Refresh token every 50 minutes (before the 1-hour expiration)
    tokenRefreshTimer.current = setInterval(async () => {
      try {
        await setAuthCookie(user);
      } catch (error) {
        console.error("Error refreshing auth token:", error);
      }
    }, 50 * 60 * 1000); // 50 minutes in milliseconds
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // Set or clear the auth cookie based on user state
      await setAuthCookie(user);

      // Setup or clear token refresh timer
      if (user) {
        setupTokenRefresh(user);
      } else {
        clearTokenRefreshTimer();
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      clearTokenRefreshTimer();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Set the auth cookie immediately after sign in
      await setAuthCookie(result.user);
      // Token refresh will be set up by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Cookie and timer will be cleared automatically by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

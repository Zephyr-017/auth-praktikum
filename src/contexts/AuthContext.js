import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

 export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backgroundTime = useRef(null);

 useEffect(() => {
   const unsub = onAuthStateChanged(auth, async (u) => {
     setUser(u);
     if (u) {
       const token = await u.getIdToken();
       await SecureStore.setItemAsync('auth_token', token);
     } else {
       await SecureStore.deleteItemAsync('auth_token');
     }
     setLoading(false);
   });
   return unsub;
 }, []);

  const logout = async () => {
    await signOut(auth);
    await SecureStore.deleteItemAsync('auth_token');
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Catat waktu saat app masuk ke background
        backgroundTime.current = Date.now();
      } else if (nextAppState === 'active') {
        // Saat kembali aktif, cek berapa lama app di background
        if (backgroundTime.current) {
          const elapsed = Date.now() - backgroundTime.current;
          if (elapsed >= 3 * 1000) { // 3 detik (untuk testing)
            if (auth.currentUser) {
              logout();
            }
          }
          backgroundTime.current = null; // Reset
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

 return (
   <AuthContext.Provider value={{ user, loading, logout }}>
     {children}
   </AuthContext.Provider>
 );
}

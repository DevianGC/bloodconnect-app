import { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const useAuthRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { email, password } = credentials;

      // Admin Login & Auto-Provisioning
      if (email === 'bloodconnectolongapo@gmail.com' && password === 'Bloodconnect_Olongap0') {
        try {
          let user;
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
          } catch (signInError) {
            // If user doesn't exist, create it
            if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/wrong-password') {
               try {
                 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                 user = userCredential.user;
               } catch (createError) {
                 // If create fails because email is in use, it means password was wrong
                 if (createError.code === 'auth/email-already-in-use') {
                    throw signInError; 
                 }
                 throw createError;
               }
            } else {
              throw signInError;
            }
          }

          // Ensure admin role in Firestore
          const docRef = doc(db, "donors", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists() || docSnap.data().role !== 'admin') {
            await setDoc(docRef, {
              name: 'BloodConnect Admin',
              email: email,
              role: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
          
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: 'BloodConnect Admin',
            role: 'admin'
          };
          
          setIsLoading(false);
          return { success: true, user: userData };

        } catch (err) {
           console.error("Admin login error:", err);
           throw err;
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before logging in.');
      }

      // Fetch additional user data from Firestore
      const docRef = doc(db, "donors", user.uid);
      const docSnap = await getDoc(docRef);

      let userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };

      if (docSnap.exists()) {
        userData = { ...userData, ...docSnap.data() };
      }
      
      // Store user info in localStorage for persistence
      localStorage.setItem('donorUser', JSON.stringify(userData));

      setIsLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setIsLoading(false);
      console.error("Login error:", err);
      let errorMessage = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Access denied. Please check your database permissions.';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { email, password, name, ...otherData } = userData;
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Update profile with name
      await updateProfile(user, {
        displayName: name
      });

      // Save additional data to Firestore
      const firestoreData = {
        name,
        email,
        ...otherData,
        createdAt: new Date().toISOString(),
        role: 'donor'
      };

      await setDoc(doc(db, "donors", user.uid), firestoreData);

      // Sign out user to force login after verification
      await signOut(auth);

      setIsLoading(false);
      return { success: true, message: 'Registration successful. Please check your email for verification.' };
    } catch (err) {
      setIsLoading(false);
      let errorMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { login, register, isLoading, error };
};

export default useAuthRequest;
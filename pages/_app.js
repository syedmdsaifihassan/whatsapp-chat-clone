import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';

// import firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// import firebase ends


function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth);

  // when a user ups in for the first time, save that user in database 
  useEffect(() => {
      if(user){
        db.collection ('users').doc(user.uid).set(
          { 
            email: user.email,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL,
          }, 
          {merge: true}
        );
      }
  }, [user]);

  if(loading) return <Loading />;
  if(!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
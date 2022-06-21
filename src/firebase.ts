import { getAnalytics } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';

export const firebaseApp = ():FirebaseApp=>
{
    const firebaseConfig = {
        apiKey: 'AIzaSyA31beHVFBEZlbGaHa2NrUYv4HvjAq31IA',
        authDomain: 'hardworking-8888.firebaseapp.com',
        projectId: 'hardworking-8888',
        storageBucket: 'hardworking-8888.appspot.com',
        messagingSenderId: '769195953001',
        appId: '1:769195953001:web:6d5d56b947f868ef284bf8',
        measurementId: 'G-MLYFL6LEMR',
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    analytics;
    
    return app;
};

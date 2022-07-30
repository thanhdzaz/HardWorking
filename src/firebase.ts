import { getAnalytics } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage,ref, StorageReference, uploadBytes,getDownloadURL } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import { UserInfo } from 'models/User/dto';

import Notify from 'components/Notify';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

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


export const firebaseAppForUser = ():FirebaseApp=>
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
    const app = initializeApp(firebaseConfig,'admin');
    
    return app;
};

export const getStore = ():Firestore => getFirestore(firebaseApp());

class FirestoreService
{
   db = getStore();

   collection = (name:string) => collection(this.db,name);

   add = async (collectionName: string,data: any): Promise<any> =>
   {
       try
       {
           const db = collection(this.db,collectionName);

           const docRef = await addDoc(db,data);

           this.update(collectionName,docRef.id,{ id: docRef.id });
   
           return Promise.resolve({ ...data, id: docRef.id });
       }
       catch (error)
       {
           return Promise.reject(error);
       }
     
   };


   update = async (collectionName: string,docName: string,data: any): Promise<any> =>
   {
       try
       {
           const docRef = doc(this.db, collectionName, docName);
           return await updateDoc(docRef, data);
       }
       catch (error)
       {
           return Promise.reject(error);
       }
   };

   addWithId= async(collectionName: string,id:string,data:any): Promise<any>=>
   {
       try
       {
           const docRef = await setDoc(doc(this.db, collectionName, id), data);
           this.update(collectionName,id,{ id });

           return Promise.resolve(docRef);
       }
       catch (error)
       {
           return Promise.reject(error);
       }

   };

   get = async(collectionName:string):Promise<any> =>
   {
        
       const coll = collection(this.db,collectionName);
       const docs = await getDocs(coll);
       const res = docs.docs.map(doc => ({ ...doc.data(),id: doc.id }));
       return res;

   };

   getByDoc = async(collectionName:string,id:string):Promise<any> =>
   {
        
       const coll = doc(this.db,collectionName,id);
       const docs = await getDoc(coll);
       const res = docs.data();
       return res;

   };

   delete = async (collectionName: string,id: string):Promise<any> =>
   {
       try
       {
           await deleteDoc(doc(this.db, collectionName, id));
           return Promise.resolve(true);
       }
       catch (error)
       {
           return Promise.reject(error);
       }
   };

   createUser = async (user: UserInfo): Promise<UserInfo | any> =>
   {

       try
       {
           const auth = getAuth(firebaseAppForUser());
           createUserWithEmailAndPassword(auth, user.email, user.password ?? '123456')
               .then(async(userCredential) =>
               {
               // Signed in
                   const u = userCredential.user;
                   await this.addWithId('Users',u.uid,user);
               // ...
               })
               .catch((error) =>
               {
               //    const errorCode = error.code;
                   const errorMessage = error.message;
                   Notify('error',errorMessage);
               // ..
               });
           return Promise.resolve(user);
       }
       catch (error)
       {
        
           return Promise.reject(error);
       }
   };

}

class Storage
{
    storage:FirebaseStorage;
    reference:StorageReference;
    constructor()
    {
        this.storage = getStorage(firebaseApp());
        this.reference = ref(this.storage);
    }

    async upload(reference:string,file:any)
    {
        if (!file)
        {
            throw new Error('File lỗi');
            return;
        }
        const { ref: f } = await uploadBytes(ref(this.storage,reference),file);

        return getDownloadURL(f);
    }
}

export const storage = new Storage();

export const firestore = new FirestoreService();

export const auth = getAuth(firebaseApp());

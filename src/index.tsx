import './index.css';

import { ConfigProvider } from 'antd';
import * as ReactDOM from 'react-dom';
import 'moment-timezone';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './App';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';
import vi from 'antd/lib/locale/vi_VN';

 
// moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const stores = initializeStores();
    

ReactDOM.render(
    <Provider {...stores}>
        <BrowserRouter>
            <ConfigProvider locale={vi}>
                <App />
            </ConfigProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement,
);

registerServiceWorker();


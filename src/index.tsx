import './index.css';

import { ConfigProvider } from 'antd';
import vi from 'antd/lib/locale/vi_VN';
import { Provider } from 'mobx-react';
import 'moment-timezone';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import initializeStores from './stores/storeInitializer';
import { firebaseApp } from 'firebase';

 
// moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const stores = initializeStores();

firebaseApp();

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

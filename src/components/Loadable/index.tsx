import Loadable, {} from 'react-loadable';
import Loading from '../Loading/index';

const LoadableComponent = (component: (() => Promise<any>)): any =>
    Loadable({
        loader: component,
        loading: Loading,
    });

export default LoadableComponent;

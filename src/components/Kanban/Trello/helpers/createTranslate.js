/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import get from 'lodash/get';
export default (TABLE) => (key) => get(TABLE, key);

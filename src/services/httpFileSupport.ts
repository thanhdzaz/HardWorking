import axios from 'axios';

axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
declare let abp: any;

class APIResourceClient
{
  API_URL = '';
  RESOURCE = '';
  HTTP_AUTHORIZATION_HEADER = '';
  client;
  serviceName;
  constructor(serviceName = '')
  {
     
      this.serviceName = serviceName;
      const qs = require('qs');


      this.client = axios.create({
          baseURL: `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}${serviceName}`,
          timeout: 30000,
          paramsSerializer(params)
          {
              return qs.stringify(params, {
                  encode: false,
              });
          },
          responseType: 'blob',
      });

      this.client.interceptors.request.use(
          function(config)
          {
              if (abp.auth.getToken())
              {
                  config.headers.common.Authorization = `Bearer ${ abp.auth.getToken()}`;
              }

              config.headers.common['.AspNetCore.Culture'] = abp.utils.getCookieValue('Abp.Localization.CultureName');
              config.headers.common['Abp.TenantId'] = abp.multiTenancy.getTenantIdCookie();

              return config;
          },
          function(error)
          {
              return Promise.reject(error);
          },
      );

      this.client.interceptors.response.use(
          response =>
          {
             
              return response.data;
          },
          error =>
          {
              // if (!!error.response && !!error.response.data.error && !!error.response.data.error.message && error.response.data.error.details)
              // {
              //     Modal.error({
              //         title: error.response.data.error.message,
              //         content: error.response.data.error.details,
              //     });
              // }
              // else if (!!error.response && !!error.response.data.error && !!error.response.data.error.message)
              // {
              //     Modal.error({
              //         title: L('LoginFailed'),
              //         content: error.response.data.error.message,
              //     });
              // }
              // else if (!error.response)
              // {
              //     Modal.error({ content: L('UnknownError') });
              // }

              // setTimeout(() =>
              // {}, 1000);

              return Promise.reject(error);
          },
      );
  }

  
    /**
   * Returns a axios configuration object given the following parameters
   * @param {String} method       HTTP Method
   * @param {String} url          Target URL
   * @param {Object} data         [Optional]: Body of the HTTP Post request
   * @param {Object} params       [Optional]: HTTP GET Parameters
   * @param {Object} extraConfig  [Optional]: Extra Axios configuration
   * @param {Object} headers      [Optional]: HTTP requests headers
   * @param {String} token        [Optional]: JWT Token
   *
   * @returns {Object}            Axios configuration object
   */


    /**
   * Makes a HTTP request
   * @param {String} method             HTTP Method
   * @param {String} url                Target URL
   * @param {Object} data               [Optional]: Body of the HTTP Post request
   * @param {Object} params             [Optional]: HTTP GET Parameters
   * @param {Object} extraConfig        [Optional]: Extra Axios configuration
   * @param {Object} headers            [Optional]: HTTP requests headers
   * @param {String} token              [Optional]: JWT Token
   * @param {String} responseProperty   [Optional]: Response property to return
   *
   * @returns {Object}            Response data from the server
   * @throws                      Exception to be captured
   */

  
}


export default APIResourceClient;


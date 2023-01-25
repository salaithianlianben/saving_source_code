import configs from '../utils/configs';
import utilities from '../utils/utilities';
import {fetchWithTimeout} from './fetchWithTimeout';
import auth from '@react-native-firebase/auth';

const log = (message, ...optionalParams) => {
  if (__DEV__) {
    console.log(message, optionalParams);
  }
};
const request = {
  sendRequest: async (path, data, method = 'POST') => {
    let url = `${configs.constant.HOST_NAME}${path}`;
    let getCurrentUserData = await auth().currentUser.getIdTokenResult(true);

    return new Promise(function (resolve, reject) {
      let option = {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentUserData.token}`,
        },
      };
      if (method.toUpperCase !== 'GET') {
        Object.assign(option, {body: JSON.stringify(data)});
      }
      log(`[${method}]`, option);
      log('URL', url);
      log('Data', JSON.stringify(data));
      fetchWithTimeout(url, option)
        .then((response) => {
          try {
            return response.json();
          } catch (err) {
            utilities.showToastMessage('Server is not responding!', 'danger');
            reject({err: 2, msg: 'Session expired'});
          }
        })
        .then((data) => {
          resolve(data);
          log(data);
          if (data.err == 8013) {
            utilities.showToastMessage(data.message, 'danger');
          }
        })
        .catch((err) => {
          log('%cERROR!!!', err);
          log('ERROR!!!', err);
          utilities.showToastMessage('Server is not responding!', 'danger');
          reject({err: 1, msg: 'Check internet connection'});
        });
    });
  },

  sendRequestGET: async (path) => {
    let url = `${configs.constant.HOST_NAME}${path}`;
    let getCurrentUserData = await auth().currentUser.getIdTokenResult(true);

    return new Promise(function (resolve, reject) {
      log('ENDPOINT URL: ', url);

      if (path === undefined) {
        return [];
      }

      let option = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getCurrentUserData.token}`,
        },
      };
      log('ENDPOINT URL HEADER: ', `Bearer ${getCurrentUserData.token}`);
      
      fetch(url, option)
        .then((response) => {
          try {
            if (response.status >= 200 && response.status <= 299) {
              return response.json();
            } else if (response.status === 400) {
              reject({err: 400, msg: 'Bad Request!'});
            } else if (response.status === 500) {
              reject({err: 500, msg: 'Internal Error!'});
            } else {
              reject({err: 0, msg: 'Error!'});
            }
          } catch (err) {
            log('ERROR 2', err);
            reject({err: 2, msg: 'Session expired'});
          }
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          log('ERROR 1', error);
          reject({err: 1, msg: 'Check internet connection'});
        });
    });
  },

  fetchFormData: async (path, formData, method = 'POST') => {
    let url = `${configs.constant.HOST_NAME}${path}`;
    log(url);
    let getCurrentUserData = await auth().currentUser.getIdTokenResult(true);

    return new Promise(function (resolve, reject) {
      let option = {
        method: method,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getCurrentUserData.token}`,
        },
        body: formData,
      };
      log(`[POST-FORM-DATA]`, JSON.stringify(formData));
      log(`[POST-OPTION]`, JSON.stringify(option));
      log('URL', url);
      fetch(url, option)
        .then((response) => {
          log('RESPONSE', response);
          try {
            return response.json();
          } catch (err) {
            reject({err: 2, msg: 'Session expired'});
          }
        })
        .then((data) => {
          console.info(data);
          resolve(data);
        })
        .catch((err) => {
          log('%ERROR!!!', 'color: red, font-size: 22', err);
          reject({err: 1, msg: 'Check internet connection'});
        });
    });
  },
  fetchFormDataCust: (path, formData, header, method = 'POST') => {
    let url = `${path}`;
    log(url);
    return new Promise(function (resolve, reject) {
      let option = {
        method: method,
        headers: header,
        body: formData,
      };
      log(`[POST-FORM-DATA]`, option);
      log('URL', url);
      fetch(url, option)
        .then((response) => {
          log('RESPONSE', response);
          try {
            return response.json();
          } catch (err) {
            reject({err: 2, msg: 'Session expired'});
          }
        })
        .then((data) => {
          console.info(data);
          resolve(data);
        })
        .catch((err) => {
          log('%ERROR!!!', 'color: red, font-size: 22', err);
          reject({err: 1, msg: 'Check internet connection'});
        });
    });
  },
};

export default request;

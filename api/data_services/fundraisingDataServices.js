import request from '../request';
import config from '../../utils/configs';

const donationDataServices = {
  getDonationList: () => {
    let path = `${config.constant.api_endpoint.DONATION_LIST}?type=Regular`;
    return request.sendRequestGET(path);
  },
  getGeneralDonation: () => {
    let path = `${config.constant.api_endpoint.DONATION_LIST}?type=General`;
    return request.sendRequestGET(path);
  }
};

export default donationDataServices;
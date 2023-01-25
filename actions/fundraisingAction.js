import fundraisingActionTypes from './action_types/fundraisingActionTypes'

const {

    FETCH_DONATION_LIST,

    FETCH_DONATION,

    FETCH_GENERAL_DONATION,

} = fundraisingActionTypes;

const fundraisingAction = {
    fetchDonationList: ()=>{
        return {
            type:FETCH_DONATION_LIST,
        }
    },
    fetchDonationById: ( id) =>{
        return {
            type:FETCH_DONATION,
            id,
        }
    },
    getGeneralDonation:() => {
        return {
            type:FETCH_GENERAL_DONATION,
        }
    }
};

export default fundraisingAction;

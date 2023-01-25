import fundraisingActionTypes from '../actions/action_types/fundraisingActionTypes';

const {
    
    FETCH_DONATION_LIST,
    FETCH_DONATION_LIST_SUCCESS,
    FETCH_DONATION_LIST_FAIL,

    FETCH_DONATION_SUCCESS,
    FETCH_DONATION_FAIL,
    FETCH_DONATION,

    FETCH_GENERAL_DONATION_SUCCESS,
    FETCH_GENERAL_DONATION,
    FETCH_GENERAL_DONATION_FAIL

} = fundraisingActionTypes;

let initStates = {
    donationList: [],
    isFetchingDonation: false,
    is_loading_donation_item:false,
    donation_item:null,
    general_donation:{},
}

const fundraisingReducer = (state = initStates,action) => {
    switch (action.type) {
        case FETCH_DONATION_LIST:
            return {
                ...state,
                isFetchingDonation:true,
            }

        case FETCH_DONATION_LIST_FAIL:
            return {
                ...state,
                isFetchingDonation:false,
            }

        case FETCH_DONATION_LIST_SUCCESS:
            return {
                ...state,
                donationList:action.data,
                isFetchingDonation:false,
            }

        case FETCH_DONATION:
            return {
                ...state,
                is_loading_donation_item:true,
            }

        case FETCH_DONATION_FAIL:
            return {
                ...state,
                is_loading_donation_item:false,
            }

        case FETCH_DONATION_SUCCESS:
            return {
                ...state,
                is_loading_donation_item:false,
                donation_item:action.data,
            }

        case FETCH_GENERAL_DONATION:
            return {
                ...state,
            }

        case FETCH_GENERAL_DONATION_FAIL:
            return {
                ...state,
            }

        case FETCH_GENERAL_DONATION_SUCCESS:
            return {
                ...state,
                general_donation:action.data
            }
        
        default:
            return state;
    }
}

export default fundraisingReducer;
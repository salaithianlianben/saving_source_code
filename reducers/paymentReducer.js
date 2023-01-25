import paymentActionTypes from "../actions/action_types/paymentActionTypes";

const {

    CREATE_PAYMENT,
    CREATE_PAYMENT_FAIL,
    CREATE_PAYMENT_SUCCESS,

    GET_PAYMENT_STATUS,
    GET_PAYMENT_STATUS_FAIL,
    GET_PAYMENT_STATUS_SUCCESS,

    GET_COMPLETE_PAYMENT_STATUS,
    GET_COMPLETE_PAYMENT_STATUS_FAIL,
    GET_COMPLETE_PAYMENT_STATUS_SUCCESS,

    CREATE_PAYMENT_WITH_PAYNOW,
    CREATE_PAYMENT_WITH_PAYNOW_FAIL,
    CREATE_PAYMENT_WITH_PAYNOW_SUCCESS,

    PAYMENT_MERCHANDISE_WITH_PAYNOW,
    PAYMENT_MERCHANDISE_WITH_PAYNOW_FAIL,
    PAYMENT_MERCHANDISE_WITH_PAYNOW_SUCCESS,

    CREATE_PAYMENT_MERCHANDISE,
    CREATE_PAYMENT_MERCHANDISE_SUCCESS,
    CREATE_PAYMENT_MERCHANDISE_FAIL,

    GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS,
    GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS_SUCCESS,
    GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS_FAIL,

    GET_PAYMENT_MERCHANDISE_STATUS,
    GET_PAYMENT_MERCHANDISE_STATUS_FAIL,
    GET_PAYMENT_MERCHANDISE_STATUS_SUCCESS,

    SEND_TRANS_REF,
    SEND_TRANS_REF_FAIL,
    SEND_TRANS_REF_SUCCESS

} = paymentActionTypes;

let initialState = {

    // merchandise payment
    is_loading_create_merchandise_payment: false,
    payment_merchandise_success: null,

    merchandise_payment_success: null,
    is_loading_check_merchandise_payment_status: false,

    is_loading_complete_merchandise_payment_status: false,

    merchandise_payment_paynow_data:null,
    is_loading_creating_merchandise_payment_with_paynow: false,

    send_transaction_code: null,
    is_loading_send_transaction_code: false,  
   // merchandise payment
   
    is_loading_create_payment:false,  
    payment_success:null,
    is_loading_check_payment_status:false,
    is_loading_complete_payment_status:false,
    payment_status:null,
    payment_paynow_data:null,
    is_loading_creating_payment_with_paynow:false,
}

const paymentReducer = (state = initialState , action) => {
    switch (action.type) {
        case CREATE_PAYMENT:
            return {
                ...state,
                is_loading_create_payment:true,
            }

        case CREATE_PAYMENT_FAIL:
            return {
                ...state,
                is_loading_create_payment:false,
            }

        case CREATE_PAYMENT_SUCCESS:
            return {
                ...state,
                is_loading_create_payment:false,
                payment_success:action.data,
            }

        case GET_COMPLETE_PAYMENT_STATUS:
            return {
                ...state,
                is_loading_complete_payment_status:true,
            }

        case GET_COMPLETE_PAYMENT_STATUS_FAIL:
            return {
                ...state,
                is_loading_complete_payment_status:false,
            }

        case GET_COMPLETE_PAYMENT_STATUS_SUCCESS:
            return {
                ...state,
                is_loading_complete_payment_status:false,
            }

        case GET_PAYMENT_STATUS:
            return {
                ...state,
                is_loading_check_payment_status:true,
                payment_status:null,
            }

        case GET_PAYMENT_STATUS_SUCCESS:
            return {
                ...state,
                is_loading_check_payment_status:false,
                payment_status:action.data,
            }

        case GET_PAYMENT_STATUS_FAIL:
            return {
                is_loading_check_payment_status:false,
                ...state,
                payment_status:null,
            }

        case CREATE_PAYMENT_WITH_PAYNOW:
            return {
                is_loading_creating_payment_with_paynow:true,
                ...state,
                payment_paynow_data:null,
            }

        case CREATE_PAYMENT_WITH_PAYNOW_FAIL:
            return {
                is_loading_creating_payment_with_paynow:false,
                ...state,
                payment_paynow_data:null,
            }

        case CREATE_PAYMENT_WITH_PAYNOW_SUCCESS:
            return {
                is_loading_creating_payment_with_paynow:false,
                ...state,
                payment_paynow_data:action.data,
            }
        case CREATE_PAYMENT_MERCHANDISE:
            return {
                ...state,
                is_loading_create_merchandise_payment: true,

            }
        case CREATE_PAYMENT_MERCHANDISE_SUCCESS: 
            return {
                ...state,
                is_loading_create_merchandise_payment: false,
                payment_merchandise_success: action.data,
            }
        case CREATE_PAYMENT_MERCHANDISE_FAIL:
            return {
                ...state,
                is_loading_create_merchandise_payment: false,
            }
        case GET_PAYMENT_MERCHANDISE_STATUS:
            return {
                ...state,
                is_loading_check_merchandise_payment_status: true,
                merchandise_payment_success: null
            }
        case GET_PAYMENT_MERCHANDISE_STATUS_FAIL:
            return {
                ...state,
                is_loading_check_merchandise_payment_status: false,
                merchandise_payment_success: null
            }
        case GET_PAYMENT_MERCHANDISE_STATUS_SUCCESS:
            return {
                ...state,
                is_loading_check_merchandise_payment_status: false,
                merchandise_payment_success: action.data
            }
        case GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS:
            return {
                ...state,
                is_loading_complete_merchandise_payment_status: true
            }
        case GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS_FAIL:
            return {
                ...state,
                is_loading_complete_merchandise_payment_status: false
            } 
        case GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS_SUCCESS:
            return {
                ...state,
                is_loading_complete_merchandise_payment_status: false
            }   
        case PAYMENT_MERCHANDISE_WITH_PAYNOW:
            return {
                ...state,
                merchandise_payment_paynow_data: null,
                is_loading_creating_merchandise_payment_with_paynow: true
            } 
        case PAYMENT_MERCHANDISE_WITH_PAYNOW_FAIL: 
            return {
                ...state,
                merchandise_payment_paynow_data: null,
                is_loading_creating_merchandise_payment_with_paynow: false
            }
        case PAYMENT_MERCHANDISE_WITH_PAYNOW_SUCCESS:
            return {
                ...state,
                merchandise_payment_paynow_data: action.data,
                is_loading_creating_merchandise_payment_with_paynow: false
            }
        case SEND_TRANS_REF:
            return {
                ...state,
                //send_transaction_code: 
                is_loading_send_transaction_code: true
            }
        case SEND_TRANS_REF_FAIL:
            return {
                ...state,
                is_loading_send_transaction_code: false
            }  
        case SEND_TRANS_REF_SUCCESS: 
            return {
                ...state,
                is_loading_send_transaction_code: false
            }          
        default:
            return {
                ...state,
                is_loading_merchandise_payment: true,
            }
    }
}

export default paymentReducer;
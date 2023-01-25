import { min } from "react-native-reanimated";
import paymentActionTypes from "./action_types/paymentActionTypes";

const {
    CREATE_PAYMENT,

    GET_COMPLETE_PAYMENT_STATUS,

    GET_PAYMENT_STATUS,

    CREATE_PAYMENT_WITH_PAYNOW,

    PAYMENT_MERCHANDISE_WITH_PAYNOW,

    CREATE_PAYMENT_MERCHANDISE,

    GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS,

    GET_PAYMENT_MERCHANDISE_STATUS,

    SEND_TRANS_REF,

    CREATE_PAYMENT_FOR_MERCHANDISE_WITH_PAYPAL,

    CREATE_PAYMENT_FOR_MERCHANDISE_WITH_PAYNOW,

} = paymentActionTypes;

const paymentAction = {
    createPayment:(payment_mode , donation_id ,parent_id,currency_code,total_amount, minimum, handlePaymentStatus) => {
        return {
            type:CREATE_PAYMENT,
            payment_mode , donation_id ,parent_id,currency_code,total_amount, minimum, handlePaymentStatus
        }
    },
    createPaymentMerchandise: (payment_mode, parent_id, currency_code, total_amount, minimum, sub_total, tax_total, items, order_id, handleMerchandisePaymentStatus) => {
        return {
            type: CREATE_PAYMENT_MERCHANDISE,
            payment_mode, parent_id, currency_code, total_amount, minimum, sub_total, tax_total, items, order_id, handleMerchandisePaymentStatus
        }
    },      
    getCompleteMerchandisePaymentStatus:  (order_id) => {
        return {
            type:GET_COMPLETE_PAYMENT_MERCHANDISE_STATUS,
            order_id,
        }
    },
    getCompletePaymentStatus:(order_id) => {
        return {
            type:GET_COMPLETE_PAYMENT_STATUS,
            order_id,
        }
    },
    getPaymentStatus:(order_id) =>{
        return {
            type:GET_PAYMENT_STATUS,
            order_id,
        }
    },
    getMerchandisePaymentStatus: (order_id) => {
        return {
            type: GET_PAYMENT_MERCHANDISE_STATUS,
            order_id,
        }
    },
    PaymentMerchandiseWithPaynow: (payment_mode, parent_id, total_amount, sub_total, tax_total, items, handleMerchandisePaymentWithPaynowStatus) => {
        return {
            type:PAYMENT_MERCHANDISE_WITH_PAYNOW,
            payment_mode, parent_id, total_amount, sub_total, tax_total, items, handleMerchandisePaymentWithPaynowStatus
        }
    },
    createPaymentWithPaynow:(payment_mode,donation_id,parent_id,total_amount,minimum, handleCallback) => {
        return {
            type:CREATE_PAYMENT_WITH_PAYNOW,
            payment_mode,donation_id,parent_id,total_amount,minimum, handleCallback,
        }
    },
    sendTransRef: (id, order_id, transaction_ref, parent_email,payment_mode, handleCallbackSendTransactionCode) => {
        return {
            type:SEND_TRANS_REF,
            id, order_id, transaction_ref, parent_email,payment_mode, handleCallbackSendTransactionCode
        }
    },
    createPaymentForMerchandiseWithPaypal:(payment_mode,parent_id,currency_code,total_amount,order_id,handleCallback) =>{
        return {
            type:CREATE_PAYMENT_FOR_MERCHANDISE_WITH_PAYPAL,
            payment_mode,parent_id,currency_code,total_amount,order_id,handleCallback
        }
    },
    createPaymentForMerchandiseWithPaynow:(payment_mode,parent_id,currency_code,order_id,handleCallback)=>{
        return {
            type:CREATE_PAYMENT_FOR_MERCHANDISE_WITH_PAYNOW,
            payment_mode,parent_id,currency_code,order_id,handleCallback
        }
    }
}

export default paymentAction;
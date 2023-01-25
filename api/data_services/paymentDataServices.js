import configs from "../../utils/configs";
import request from "../request";

const paymentDataServices = {
    createPayment:(payment_mode , donation_id ,parent_id,currency_code,total_amount, minimum) =>{
        let path = `${configs.constant.api_endpoint.CREATE_PAYMENT}`;
        const data = {
            payment_mode , 
            donation_id ,
            parent_id,
            currency_code,
            total_amount, 
            minimum, 
          
        }

        return request.sendRequest(path,data,'POST');
    },
    createMerchandisePayment: (payment_mode, parent_id, currency_code, total_amount, minimum, sub_total, tax_total, itemsPayment, order_id) => {
        let path = `${configs.constant.api_endpoint.CREATE_PAYMENT}`;
        const data = {
            "payment_mode": payment_mode,
            "parent_id": parent_id,
            "currency_code": currency_code,
            "total_amount": total_amount,
            "minimum": minimum,
            "sub_total":sub_total,
            "tax_total":tax_total,
            "items": itemsPayment,
            "order_id": order_id
        }

        return request.sendRequest(path,data,'POST');
    },
    getMerchandisePaymentStatus: (order_id) => {
        let path = `${configs.constant.api_endpoint.GET_PAYMENT_STATUS}?order_id=${order_id}`;
        return request.sendRequestGET(path);
    },
    postCompleteMerchandisePaymentStatus: (order_id) => {
        let path =  `${configs.constant.api_endpoint.GET_COMPLETE_PAYMENT_STATUS}`;
        const formData = new FormData();
        formData.append('order_id',order_id);

        return request.fetchFormData(path,formData,'POST');
    },
    getPaymentStatus: (order_id) => {
        let path = `${configs.constant.api_endpoint.GET_PAYMENT_STATUS}?order_id=${order_id}`;
        return request.sendRequestGET(path);
    },
    postCompletePaymentStatus:(order_id) =>{
        let path = `${configs.constant.api_endpoint.GET_COMPLETE_PAYMENT_STATUS}`;
        const formData = new FormData();
        formData.append('token',order_id);

        return request.fetchFormData(path,formData,'POST');
    },
    createPaymentWithPayNow:(payment_mode,donation_id,parent_id,total_amount,minimum)=>{
        let path = `${configs.constant.api_endpoint.CREATE_PAYMENT_WITH_PAYNOW}`;
        const data = {
            payment_mode ,
            donation_id,
            parent_id,
            total_amount,
            minimum,
          
        }

        return request.sendRequest(path,data,'POST');


        
    },
    createMerchandisePaymentWithPayNow: (payment_mode, parent_id, total_amount, sub_total, tax_total, itemsPayment, order_id) => {
        let path = `${configs.constant.api_endpoint.CREATE_PAYMENT_WITH_PAYNOW}`;
        const data = {
            "payment_mode" : payment_mode ,
            "parent_id" : parent_id,
            "total_amount" : total_amount,
            "sub_total" : sub_total,
            "tax_total" : tax_total,
            "items" : itemsPayment,
            "order_id" : order_id
        }

        return request.sendRequest(path,data,'POST');
    },
    sendTransactionCode: (id, order_id, transaction_ref, parent_email,payment_mode) => {
        let path = `${configs.constant.api_endpoint.SEND_TRANS_REF}`;
        

        const formData = new FormData();
        formData.append('id',id);
        if(order_id != undefined && order_id != "" && order_id != null)
        formData.append('order_id',order_id);
        formData.append('transaction_ref',transaction_ref);
        formData.append('parent_email',parent_email);
        formData.append('payment_mode',payment_mode);

        return request.fetchFormData(path,formData,'POST');
    },
    createPaymentForMerchandiseWithPaynow: (payment_mode, parent_id, currency_code, order_id) => {
        let path = `${configs.constant.api_endpoint.CREATE_PAYMENT_WITH_PAYNOW}`;
        const data = {
            "payment_mode" : payment_mode ,
            "parent_id" : parent_id,
            "currency_code":currency_code,
            "order_id" : order_id
        }

        return request.sendRequest(path,data,'POST');
    },
    createPaymentForMerchandiseWithPaypal: (payment_mode, parent_id, currency_code,total_amount,  order_id) => {
        let path = `${configs.constant.api_endpoint.CREATE_PAYMENT}`;
        const data = {
            "payment_mode": payment_mode,
            "parent_id": parent_id,
            "currency_code": currency_code,
            "total_amount":total_amount,
            "order_id": order_id
        }

        return request.sendRequest(path,data,'POST');
    },
}

export default paymentDataServices;
import axios from 'axios';
import config from '../../config';

const initiatePayment = async () => {
  const response = await axios.post(config.amarpay_base_url as string, {
    store_id: "aamarpaytest",
    signature_key: config.amarypay_signature_key,
    tran_id: '123123173',
    success_url: 'http://www.merchantdomain.com/sucesspage.html',
    fail_url: 'http://www.merchantdomain.com/failedpage.html',
    cancel_url: 'http://www.merchantdomain.com/cancellpage.html',
    amount: '10.0',
    currency: 'BDT',
    desc: 'Merchant Registration Payment',
    cus_name: 'Name',
    cus_email: 'payer@merchantcusomter.com',
    cus_add1: 'House B-158 Road 22',
    cus_add2: 'Mohakhali DOHS',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1206',
    cus_country: 'Bangladesh',
    cus_phone: '+8801704',
    type: 'json',
  });
  console.log('pay,', response.data);
};

export default initiatePayment;

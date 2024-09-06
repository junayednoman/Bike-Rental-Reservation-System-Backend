/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const SSLCommerzPayment = require('sslcommerz-lts');
const store_id = 'ridef66da94c92ca21';
const store_passwd = 'ridef66da94c92ca21@ssl';
const is_live = false; //true for live, false for sandbox

function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomBytes = 'xxxxxxxxxxxxxxxx'.replace(/x/g, () =>
    ((Math.random() * 16) | 0).toString(16),
  );

  return timestamp + randomBytes;
}

const transactionId = generateObjectId();

export const initiatePayment = async () => {
  const data = {
    total_amount: 100,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `http://localhost:5000/api/rentals/payment-success/${transactionId}`,
    fail_url: `http://localhost:5000/api/rentals/payment-fail/${transactionId}`,
    cancel_url: 'http://localhost:3030/cancel',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'customer@example.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const initPaymentUrl = sslcz
    .init(data)
    .then((apiResponse: { GatewayPageURL: string }) => {
      return apiResponse.GatewayPageURL;
    });
  const url = await initPaymentUrl;
  return { url, transactionId };
};

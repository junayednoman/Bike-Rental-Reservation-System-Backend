/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

import config from '../../config';
import { TPaymentInfo } from './payment.interface';

const SSLCommerzPayment = require('sslcommerz-lts');
const store_id = config?.sslcz_store_id;
const store_passwd = config?.sslcz_store_password;
const is_live = false; //true for live, false for sandbox

function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomBytes = 'xxxxxxxxxxxxxxxx'.replace(/x/g, () =>
    ((Math.random() * 16) | 0).toString(16),
  );

  return timestamp + randomBytes;
}


export const initiatePayment = async (paymentInfo: TPaymentInfo) => {
  const transactionId = generateObjectId();
  const {
    total_amount,
    currency,
    product_name,
    product_category,
    cus_name,
    cus_email,
    cus_add1,
    cus_country,
    cus_phone,
    success_url,
    fail_url,
  } = paymentInfo;
  const data = {
    total_amount,
    currency,
    tran_id: transactionId,
    success_url: `${success_url}/${transactionId}`,
    fail_url: `${fail_url}/${transactionId}`,
    cancel_url: 'https://www.youtube.com/',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'null',
    product_name,
    product_category,
    product_profile: 'null',
    cus_name,
    cus_email,
    cus_add1,
    cus_add2: 'null',
    cus_city: 'null',
    cus_state: 'null',
    cus_postcode: 'null',
    cus_country,
    cus_phone,
    cus_fax: 'null',
    ship_name: 'null',
    ship_add1: 'null',
    ship_add2: 'null',
    ship_city: 'null',
    ship_state: 'null',
    ship_postcode: 'null',
    ship_country: 'null',
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

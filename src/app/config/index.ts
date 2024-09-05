import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  hash_salt_rounds: process.env.SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRE,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRE,
  amarpay_base_url: process.env.AMARPAY_BASE_URL,
  amarypay_store_id: process.env.AMARPAY_STORE_ID,
  amarypay_signature_key: process.env.AMARPAY_SIGNATURE_KEY,
};

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
  sslcz_store_id: process.env.SSLCMZ_STORE_ID,
  sslcz_store_password: process.env.SSLCMZ_STORE_PASSWORD,
  is_app_live: process.env.IS_APP_LIVE,
};

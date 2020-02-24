export const config = {
  db: {
    username: process.env.UDAGRAM_DB_USER,
    password: process.env.UDAGRAM_DB_PASSWORD,
    database: process.env.UDAGRAM_DB_NAME,
    host: process.env.UDAGRAM_DB_HOST,
    dialect: process.env.UDAGRAM_DB_DIALECT
  },
  jwt: {
    secret: process.env.UDAGRAM_JWT_KEY
  }
};

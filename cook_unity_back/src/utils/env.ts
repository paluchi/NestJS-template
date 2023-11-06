// This file is used to store all the environment variables, so we can use them in the whole application keeping the code clean and readable.
export default {
  DATABASE_URL: process.env.DATABASE_URL || '',

  JWT_KEY_USERS: process.env.JWT_KEY_USERS || '',
  JWT_KEY_INTERNS: process.env.JWT_KEY_INTERNS || '',
};

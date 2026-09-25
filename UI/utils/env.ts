function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

export const env = {
  userEmail: required('USER_EMAIL'),
  userPassword: required('USER_PASSWORD'),
  userName: required('USER_NAME'),
};
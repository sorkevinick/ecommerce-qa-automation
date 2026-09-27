function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

export const env = {
  storeUrl: required('STORE_URL'),
  username: required('STORE_USERNAME'),
  password: required('STORE_PASSWORD'),
};
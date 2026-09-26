function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  apiUser: required('API_USER'),
  apiPassword: required('API_PASSWORD'),
};
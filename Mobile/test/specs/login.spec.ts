import LoginScreen from '../screens/LoginScreen';
import MyStoreScreen from '../screens/MyStoreScreen';
import { env } from '../../utils/env';

describe('Store manager login (smoke test)', () => {
  it('should log in and display the store dashboard', async () => {
    await LoginScreen.login(env.storeUrl, env.username, env.password);

    await expect(MyStoreScreen.storeName).toBeDisplayed();
  });
});
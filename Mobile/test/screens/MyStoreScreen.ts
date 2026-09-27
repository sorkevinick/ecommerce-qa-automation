import { byText } from '../../utils/selectors';

class MyStoreScreen {
  get storeName() { return byText('EBAC - Shop'); }
}

export default new MyStoreScreen();
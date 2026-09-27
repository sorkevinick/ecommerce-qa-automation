import { byId } from '../../utils/selectors';

class ProductDetailsScreen {
  get productNameField() { return byId('editText'); }
  get navigateUpButton() { return $('~Navigate up'); }
}

export default new ProductDetailsScreen();
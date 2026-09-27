import { byId, byText } from '../../utils/selectors';

class LoginScreen {
  get enterStoreAddressButton() { return byText('Enter your store address'); }
  get storeAddressInput() { return $('android=new UiSelector().className("android.widget.EditText")'); }
  get continueButton() { return byId('bottom_button'); }
  get continueWithStoreCredentialsButton() { return byId('login_site_creds'); }
  get usernameInput() { return byText('Username'); }
  get passwordInput() { return byText('Password'); }
  get enterPasswordInsteadButton() { return byId('login_enter_password'); }

  async login(storeUrl: string, username: string, password: string) {
    await this.enterStoreAddressButton.click();
    await this.storeAddressInput.setValue(storeUrl);
    await this.continueButton.click();
    await this.continueWithStoreCredentialsButton.click();

    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.continueButton.click();

    // Some sessions add a verification step that offers to confirm with the password
    const needsVerification = await this.enterPasswordInsteadButton
      .waitForDisplayed({ timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (needsVerification) {
      await this.enterPasswordInsteadButton.click();
      await this.passwordInput.setValue(password);
      await this.continueButton.click();
    }
  }
}

export default new LoginScreen();
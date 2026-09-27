const APP_PACKAGE = 'com.woocommerce.android';

// Locates an element by its resource-id (e.g. "bottom_button")
export const byId = (id: string) =>
  $(`android=new UiSelector().resourceId("${APP_PACKAGE}:id/${id}")`);

// Locates an element by its exact visible text
export const byText = (text: string) => $(`android=new UiSelector().text("${text}")`);
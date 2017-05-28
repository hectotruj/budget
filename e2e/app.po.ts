import { browser, by, element } from 'protractor';

<<<<<<< HEAD
export class BudgetPage {
=======
export class MyAppPage {
>>>>>>> 534b4e25668200509702d4b1a60b130263bb1569
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}

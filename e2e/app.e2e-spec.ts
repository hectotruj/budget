<<<<<<< HEAD
import { BudgetPage } from './app.po';

describe('budget App', () => {
  let page: BudgetPage;

  beforeEach(() => {
    page = new BudgetPage();
=======
import { MyAppPage } from './app.po';

describe('my-app App', () => {
  let page: MyAppPage;

  beforeEach(() => {
    page = new MyAppPage();
>>>>>>> 534b4e25668200509702d4b1a60b130263bb1569
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

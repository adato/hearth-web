describe('hearth login', function() {  

  beforeEach(function() {
    protractor.helpers.HearthApp.navigateTo('login');
  });

  it('should see login dialog', function () {
    var loginDialog = element.all(by.css('.register-login-dialog'));
    expect(loginDialog.count()).toEqual(1);
  });


  it('should not log in using random credentials', function() {
    var loginButton = element(by.css('button.button-send'));
    var emailInput = element(by.model('data.username'));
    var passwordInput = element(by.model('data.password'));

    loginButton.click();
    expect(element(by.css('form.login-form>p.error')).getText()).toBe('Jméno nebo heslo nesedí. Zkuste to prosím ještě jednou.');

    emailInput.sendKeys('tester.testovic@testov.com');
    passwordInput.sendKeys('testerovoHeslo');
    expect(emailInput.getAttribute('value')).toBe('tester.testovic@testov.com');
    expect(passwordInput.getAttribute('value')).toBe('testerovoHeslo');

    loginButton.click();

    expect(element(by.css('form.login-form>p.error')).getText()).toBe('Jméno nebo heslo nesedí. Zkuste to prosím ještě jednou.');
  });
  

  // sendpassword form
});
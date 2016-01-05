describe('hearth registration', function() {  

  beforeEach(function() {
    protractor.helpers.HearthApp.navigateTo('register');
  });

  it('should see register dialog', function () {
    var registerDialog = element.all(by.css('.register-login-dialog'));
    expect(registerDialog.count()).toEqual(1);
  });


  it('should validate fine', function() {
    var registerButton = element(by.css('button.button-send'));
    var emailInput = element(by.model('user.email'));
    var usernameInput = element(by.model('user.name'));
    var passwordInput = element(by.model('user.password'));

    // none of validation errors displayed
    expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([ false, false, false, false, false, false, false, false ]);
    registerButton.click();

    // some validation errors displayed
    expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([ true, false, true, false, false, false, true, false ]);

    usernameInput.sendKeys('Testerovo Jmeno');

    // some validation errors displayed
    expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([ false, false, true, false, false, false, true, false ]);

    emailInput.sendKeys('tester.testovic@testov.com');

    // some validation errors displayed
    expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([ false, false, false, false, false, false, true, false ]);

    passwordInput.sendKeys('testerovoHeslo');

    // none of validation errors displayed
    expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([ false, false, false, false, false, false, false, false ]);
  });


  it('should validate email in various ways', function() {
    var emailInput = element(by.model('user.email'));

    expect(element(by.css('[ng-show="registerForm.email.$error.email"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.email.$error.used"]')).isDisplayed()).toBeFalsy();

    emailInput.sendKeys(protractor.Key.TAB);

    expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeTruthy();

    emailInput.sendKeys('tester', protractor.Key.TAB);


    expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.email.$error.email"]')).isDisplayed()).toBeTruthy();

    emailInput.clear();
    emailInput.sendKeys('tester@test.com', protractor.Key.TAB);

    expect(element(by.css('[ng-show="registerForm.email.$error.email"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.email.$error.used"]')).isDisplayed()).toBeFalsy();

  });


  it('should validate password', function() {
    var passwordInput = element(by.model('user.password'));

    expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.password.$error.minlength"]')).isDisplayed()).toBeFalsy();

    passwordInput.sendKeys(protractor.Key.TAB);

    expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeTruthy();

    passwordInput.sendKeys('tes', protractor.Key.TAB);

    expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.password.$error.minlength"]')).isDisplayed()).toBeTruthy();

    passwordInput.clear();
    passwordInput.sendKeys('t35t0v4c1_h3510', protractor.Key.TAB);

    expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('[ng-show="registerForm.password.$error.minlength"]')).isDisplayed()).toBeFalsy();

  });


  it('should not see terms and see them after click', function() {
    expect(element(by.css('.terms')).isDisplayed()).toBeFalsy();

    // click on "show terms", should show them
    element.all(by.css('.register-login-form .bottom>p>a')).first().click();

    expect(element(by.css('.terms')).isDisplayed()).toBeTruthy();
    
    // click on "show terms" again, should hide them
    element.all(by.css('.register-login-form .bottom>p>a')).first().click();

    expect(element(by.css('.terms')).isDisplayed()).toBeFalsy();

  });

});
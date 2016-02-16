var testEmail = protractor.helpers.getTestEmail();
var emailListener = protractor.helpers.getEmailListener();

describe('hearth registration', function () {

	beforeEach(function () {
		protractor.helpers.navigateTo('register');
	});

	it('should be able to go to register form throught login dialog', function () {
		// go to login page
		element(by.id('nav-login')).click();
		expect(element.all(by.css('.login-form')).isDisplayed()).toBeTruthy();

		element
		  .all(by.css('.login-form a[href*="register"]'))
		  .get(1)
		  .click();

		// go to register page
		element(by.css('.login-form a[href*="register"]')).get(1).click();

		// test if register form is visible
		expect(element.all(by.css('.register-form')).isDisplayed()).toBeTruthy();

		// go back to login and test if it is visible
		element(by.css('.register-form .bottom a[href*="login"]')).click()
		expect(element.all(by.css('.login-form')).isDisplayed()).toBeTruthy();
	});


	it('should validate fine', function () {
		var registerButton = element(by.css('button.button-send'));
		var emailInput = element(by.model('user.email'));
		var firstNameInput = element(by.model('user.first_name'));
		var lastNameInput = element(by.model('user.last_name'));
		var passwordInput = element(by.model('user.password'));

		// none of validation errors displayed
		expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([false, false, false, false, false, false, false, false, false]);

		registerButton.click();
		expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([true, false, false, true, false, false, false, true, false]);

		firstNameInput.sendKeys('Testerovo');
		lastNameInput.sendKeys('Jmeno');
		expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([false, false, false, true, false, false, false, true, false]);

		emailInput.sendKeys('testovaci@hearth.net');
		expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([false, false, false, false, false, false, false, true, false]);

		passwordInput.sendKeys('testerovoHeslo');
		expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([false, false, false, false, false, false, false, false, false]);
	});


	it('should validate email in various ways', function () {
		var emailInput = element(by.model('user.email'));

		expect(element(by.css('[ng-show="registerForm.email.$error.email"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.email.$error.used"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="apiErrors.email"]')).isDisplayed()).toBeFalsy();

		emailInput.sendKeys(protractor.Key.TAB);
		expect(element(by.css('[ng-show="registerForm.email.$error.email"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeTruthy();
		expect(element(by.css('[ng-show="registerForm.email.$error.used"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="apiErrors.email"]')).isDisplayed()).toBeFalsy();

		emailInput.sendKeys('tester', protractor.Key.TAB);
		expect(element(by.css('[ng-show="registerForm.email.$error.email"]')).isDisplayed()).toBeTruthy();
		expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.email.$error.used"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="apiErrors.email"]')).isDisplayed()).toBeFalsy();

		emailInput.clear();
		emailInput.sendKeys('tester@test.com', protractor.Key.TAB);
		expect(element(by.css('[ng-show="registerForm.email.$error.email"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.email.$error.required"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.email.$error.used"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="apiErrors.email"]')).isDisplayed()).toBeFalsy();
	});


	it('should validate password', function () {
		var passwordInput = element(by.model('user.password'));

		expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.password.$error.minlength"]')).isDisplayed()).toBeFalsy();

		passwordInput.sendKeys(protractor.Key.TAB);
		expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeTruthy();
		expect(element(by.css('[ng-show="registerForm.password.$error.minlength"]')).isDisplayed()).toBeFalsy();

		passwordInput.sendKeys('tes', protractor.Key.TAB);
		expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.password.$error.minlength"]')).isDisplayed()).toBeTruthy();

		passwordInput.clear();
		passwordInput.sendKeys('t35t0v4c1_h3510', protractor.Key.TAB);
		expect(element(by.css('[ng-show="registerForm.password.$error.required"]')).isDisplayed()).toBeFalsy();
		expect(element(by.css('[ng-show="registerForm.password.$error.minlength"]')).isDisplayed()).toBeFalsy();
	});


	it('should not see terms and see them after click', function () {

		// click on "show terms", should show them
		element.all(by.css('.register-form .bottom>p>a')).first().click();

		expect(element(by.css('.ngdialog-fullwidth')).isDisplayed()).toBeTruthy();

		// close terms button, should hide them
		element.all(by.css('.ngdialog-fullwidth header span.close')).first().click();

		browser.sleep(1000);
		expect(element(by.css('.ngdialog-fullwidth')).isPresent()).toBeFalsy();
	});

	it('should register new user', function () {
		var origAddress = null;
		var registerButton = element(by.css('button.button-send'));
		var emailInput = element(by.model('user.email'));
		var firstNameInput = element(by.model('user.first_name'));
		var lastNameInput = element(by.model('user.last_name'));
		var passwordInput = element(by.model('user.password'));

		// none of validation errors displayed
		// some validation errors displayed
		firstNameInput.sendKeys('Testerovo');
		lastNameInput.sendKeys('Jmeno');
		emailInput.sendKeys(testEmail);
		passwordInput.sendKeys(protractor.helpers.options.testPassword);

		// none of validation errors displayed
		expect(element.all(by.css('.register-login-form>div.error>span')).isDisplayed()).toEqual([false, false, false, false, false, false, false, false, false]);
		// send registration
		registerButton.click();

		console.log("> Using register credentials: ", testEmail, protractor.helpers.options.testPassword);
		expect(element.all(by.css('.register-successful')).isDisplayed()).toBeTruthy();

		browser.getCurrentUrl().then(function (url) {
			origAddress = protractor.helpers.parseLocation(url);

			browser.wait(function () {
				return emailListener;
			}, 30000).then(function (email) {
				var urls = protractor.helpers.getRegConfirmUrlFromText(email.html);
				var confirmUrlParsed = protractor.helpers.parseLocation(urls[0]);
				var confirmUrl = origAddress.protocol + '//' + origAddress.host + confirmUrlParsed.pathname + confirmUrlParsed.search;

				console.log('Parsed confirm url:', urls[0], 'decoded as:', confirmUrl);

				protractor.helpers.navigateToFull(confirmUrl);
				expect(element.all(by.css('.confirm-register-dialog')).isDisplayed()).toBeTruthy();
				browser.sleep(1500);
				expect(element(by.css('.market')).isPresent()).toBeTruthy();
			});

		});
	});
});
const beacon = require('../utils.js').beacon;

describe('hearth hardcoded login', function() {

	beforeEach(function() {
		protractor.helpers.navigateTo('');
	});

	it('should be able to log in default user', function() {
		var loginButton = beacon('nav-login');
		expect(loginButton.isPresent()).toBeTruthy();
		loginButton.click();

		// should be on login page
		expect(element(by.css('.login-form')).isPresent()).toBeTruthy();

		var loginButton = element(by.css('button.button-send'));
		var emailInput = element(by.css('input.login_name'));
		var passwordInput = element(by.css('input.login_password'));

		var testEmail = protractor.helpers.config().loginName;
		var testPassword = protractor.helpers.config().loginPassword;

		// some validation errors displayed
		emailInput.sendKeys(testEmail);
		passwordInput.sendKeys(testPassword);

		// send registration
		loginButton.click();
		expect(element(by.css('.logged-user-dropdown')).isPresent()).toBeTruthy();
	});
});

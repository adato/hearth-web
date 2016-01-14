var testEmail = protractor.helpers.HearthApp.getTestEmail();

describe('hearth login', function() {

	beforeEach(function() {
		protractor.helpers.HearthApp.navigateTo('');
	});

	it('should be able to log out previously logged user', function() {

		// if user is logged in - logout him
		element(by.css('.logged-user-dropdown')).isPresent().then(function(result) {
			if (result) {
				console.log('User is logged in -> logouting');

				var navigationMenu = element(by.css(".logged-user-dropdown"));


				browser.actions().mouseMove(navigationMenu).perform();

				element(by.css("nav .logout-link")).click();
				browser.sleep(1000);
				// navigationMenu.click();

			} else {
				console.log('User is not logged in');
			}
		});
	});

	it('should be able to log in freshly registered user', function() {
		var loginButton = element(by.id('nav-login'));
		expect(loginButton.isPresent()).toBeTruthy();
		loginButton.click();

		// should be on login page
		expect(element(by.css('.login-form')).isPresent()).toBeTruthy();

		var loginButton = element(by.css('button.button-send'));
		var emailInput = element(by.css('input.login_name'));
		var passwordInput = element(by.css('input.login_password'));

		console.log("> Using login credentials: ", testEmail, protractor.helpers.HearthApp.options.testPassword);
		// some validation errors displayed
		emailInput.sendKeys(testEmail);
		passwordInput.sendKeys(protractor.helpers.HearthApp.options.testPassword);

		// send registration
		loginButton.click();
		expect(element(by.css('.logged-user-dropdown')).isPresent()).toBeTruthy();
	});
});

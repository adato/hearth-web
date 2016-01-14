var testEmail = protractor.helpers.HearthApp.getTestEmail();
var testPassword = protractor.helpers.HearthApp.options.testPassword;

describe('hearth remove user', function() {

	beforeEach(function() {
		protractor.helpers.HearthApp.navigateTo('');
	});

	it('should be able to remove user', function() {

		function getVisibleErrors(driver) {
			var errors = driver.findElements(by.css(".delete-account div.error span"));
			return protractor.promise.filter(errors, function(error) {
					return error.isDisplayed();
				})
				.then(function(visibleError) {
					return visibleError;
				});
		}

		// user should be logged in
		expect(element(by.css('.logged-user-dropdown')).isPresent()).toBeTruthy();

		// go to user setting
		var navigationMenu = element(by.css(".logged-user-dropdown"));
		browser.actions().mouseMove(navigationMenu).perform();
		element(by.css("nav .user-settings-link")).click();

		// should be on profile settings
		expect(element(by.css('.profile-settings')).isPresent()).toBeTruthy();

		var delTextarea = element(by.css(".delete-account textarea"));
		var delPassword = element(by.css('.delete-account input[type="password"]'));
		var delButton = element(by.css(".delete-account .button-send"));

		delPassword.sendKeys('Wrong password');

		// focus out from password to see error
		element(by.id("newPass")).sendKeys('a');
		element.all(getVisibleErrors).then(function (items) {
			// there will be shown error that we put there wrong password
			expect(items.length).toBe(1);

			// clear input and delete account
			delPassword.clear().then(function() {
				delPassword.sendKeys(testPassword);
				delTextarea.sendKeys('Deleting test account');
				delButton.click();
				browser.sleep(500);
				
				expect(element(by.css('.logged-user-dropdown')).isPresent()).toBeFalsy();
			});
		});
	});
});

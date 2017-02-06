var testPassword = protractor.helpers.config().loginPassword;
const beacon = require('../utils.js').beacon;

describe('hearth remove user', function() {

  beforeAll(function() {
    protractor.helpers.login();
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
    var navigationMenu = element(by.css(".logged-user-dropdown"));
    expect(navigationMenu.isPresent()).toBeTruthy();

    // go to user setting

		browser.actions().mouseMove(navigationMenu).perform();
		element(by.css("nav .user-settings-link")).click();

		// should be on profile settings
		expect(element(by.css('.profile-settings')).isPresent()).toBeTruthy();

		var delTextarea = element(by.css(".delete-account textarea"));
		var delPassword = element(by.css('.delete-account input[type="password"]'));
		var delButton = beacon('delete-account-button');

		delPassword.sendKeys('Wrong password');

		// focus out from password to see error
		element(by.id("newPass")).sendKeys('a');
		element.all(getVisibleErrors).then(function (items) {
			// there will be shown error that we put there wrong password
			expect(items.length).toBe(1);

			// clear input and delete account
			delPassword.clear().then(function() {
				delPassword.sendKeys(testPassword);
				delTextarea.sendKeys('$1bf6cc4c - Deleting test account');
				delButton.click();
				browser.sleep(500);

				expect(element(by.css('.logged-user-dropdown')).isPresent()).toBeFalsy();
			});
		});
	});
});

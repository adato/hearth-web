var testPassword = protractor.helpers.config().loginPassword;
const beacon = require('../utils.js').beacon;

describe('hearth remove user', function() {

  beforeAll(function() {
    protractor.helpers.login();
  });

	it('should be able to remove user', function() {

		function getVisibleErrors(driver) {
			var errors = driver.findElements(by.css('[test-beacon="profile-delete-form"] [test-beacon="user-delete-errors"] *'));
			return protractor.promise.filter(errors, function(error) {
				return error.isDisplayed();
			})
			.then(function(visibleError) {
				return visibleError;
			});
		}

    // user should be logged in
    var navigationMenu = beacon('logged-user-dropdown');
    expect(navigationMenu.isPresent()).toBeTruthy();

    // go to user setting

		browser.actions().mouseMove(navigationMenu).perform();
		beacon('user-settings-link').click();

		// should be on profile settings
		expect(beacon('profile-settings').isPresent()).toBeTruthy();

		var delTextarea = beacon('user-delete-reason');
		var delPassword = beacon('user-delete-password');
		var delButton = beacon('delete-account-button');

		delPassword.sendKeys('Wrong password');

		// focus out from password to see error
		beacon('new-password').sendKeys('a');
		element.all(getVisibleErrors).then(function (items) {
			// there will be shown error that we put there wrong password
			expect(items.length).toBe(1);

			// clear input and delete account
			delPassword.clear().then(function() {
				delPassword.sendKeys(testPassword);
				delTextarea.sendKeys('$1bf6cc4c - Deleting test account');
				delButton.click();
				browser.sleep(500);

				expect(beacon('logged-user-dropdown').isPresent()).toBeFalsy();
			});
		});
	});
});

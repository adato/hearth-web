describe('hearth report abusive post', function() {

	beforeEach(function() {
		protractor.helpers.navigateTo('');
		browser.waitForAngular();
	});

	it('should see "report abusive post" modal on market', function() {
		browser.sleep(1000);

		var elAll = element.all(by.className('item-common')).get(0);
		var expectedDropdown = elAll.element(by.css('ul.actions-dropdown'));
		var dropdownReportPostLink = elAll.element(by.css('[test-beacon="marketplace-item-flag"]'));
		var dropdownArrow = elAll.element(by.css('[test-beacon="marketplace-item-dropdown-toggle"]'));
		var modal = element(by.css('div[test-beacon="flag-post-modal"]'));
		var modalCloseButton = element(by.css('div[test-beacon="flag-post-modal"] a.close'));

		dropdownArrow.click();
		expect(expectedDropdown.isDisplayed()).toBeTruthy();
		browser.sleep(100);
		dropdownReportPostLink.click();
		browser.sleep(500);
		expect(modal.isPresent()).toBeTruthy();
		modalCloseButton.click();
		browser.sleep(500);
		expect(modal.isPresent()).toBeFalsy();

	});

});

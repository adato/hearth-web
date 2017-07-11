const beacon = require('../utils.js').beacon;

describe('hearth bookmarks', function() {

  beforeAll(function() {
    protractor.helpers.login();
  });

	function navigateToMyFav() {
		browser.actions().mouseMove(beacon('logged-user-dropdown'), {x: 0, y: 0}).perform();
		var topMenuLink = beacon('dropdown-my-profile');
		topMenuLink.click();

		var profileBubble = element(by.css('span.shadow.large>a'));
		profileBubble.click();

		var myFavLink = element.all(by.css('div.bottom-tabs>ul>li')).get(1).element(by.css('a'));
		myFavLink.click();
	}

	it('should be able to make a bookmark on marketplace', function() {
		var elAll = element.all(by.className('item-common')).get(0);
		var expectedDropdown = elAll.element(by.css('ul.actions-dropdown'));
		var dropdownBookmarkLink = elAll.element(by.css('[test-beacon="marketplace-item-add-bookmark"]'));
		var dropdownArrow = elAll.element(by.css('[test-beacon="marketplace-item-dropdown-toggle"]'));
		var notify = element(by.css('#notify-top>.alert-box'));


		expect(notify.isPresent()).toBeFalsy();
		expect(expectedDropdown.isDisplayed()).toBeFalsy();
		dropdownArrow.click();
		expect(expectedDropdown.isDisplayed()).toBeTruthy();
		dropdownBookmarkLink.click();
		expect(notify.isPresent()).toBeTruthy();
	});


	it('should be able to make a bookmark on post detail', function() {
    	protractor.helpers.navigateTo('');
		var elAll = element.all(by.className('item-common')).get(1);
		var postDetailLink = elAll.element(by.css('h1>a'));

		var elPostDetail = element(by.css('.main-container>.item-common'));
		var dropdownBookmarkLink = elPostDetail.element(by.css('[test-beacon="marketplace-item-add-bookmark"]'));
		var dropdownArrow = elPostDetail.element(by.css('[test-beacon="marketplace-item-dropdown-toggle"]'));
		var notify = element(by.css('#notify-top>.alert-box'));

		expect(notify.isPresent()).toBeFalsy();
		postDetailLink.click().then(function () {
			// on post detail
			dropdownArrow.click();
			dropdownBookmarkLink.click();
			expect(notify.isPresent()).toBeTruthy();
		});
	});

	it('should be able to go to profile and see bookmarked items', function() {
    	browser.sleep(500);
		// navigate to profile through top menu
		navigateToMyFav();

		var marketItems = element.all(by.className('item-common'));
		expect(marketItems.count()).toBe(2); // count items
	});

	it('should be able to remove bookmarked items from profile', function() {
		navigateToMyFav();
		var marketItems = element.all(by.className('item-common'));


		function removeItem() {
			var elAll = element.all(by.className('item-common')).get(0);
			var expectedDropdown = elAll.element(by.css('ul.actions-dropdown'));
			var dropdownBookmarkLink = elAll.element(by.css('[test-beacon="marketplace-item-remove-bookmark"]'));
			var dropdownArrow = elAll.element(by.css('[test-beacon="marketplace-item-dropdown-toggle"]'));
			var notify = element(by.css('#notify-top>.alert-box'));

		    browser.sleep(4000);

			expect(notify.isPresent()).toBeFalsy();
			expect(expectedDropdown.isDisplayed()).toBeFalsy();
			dropdownArrow.click();
			expect(expectedDropdown.isDisplayed()).toBeTruthy();
			dropdownBookmarkLink.click();
			expect(notify.isPresent()).toBeTruthy();
		}

		expect(marketItems.count()).toBe(2); // count items
		removeItem();
	    browser.sleep(500);
		expect(marketItems.count()).toBe(1); // count items

		removeItem();
		browser.sleep(500);
		expect(marketItems.count()).toBe(0); // count items	
	});
});

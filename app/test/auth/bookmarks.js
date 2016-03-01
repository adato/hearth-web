
describe('hearth bookmarks', function() {

	beforeEach(function() {
		protractor.helpers.navigateTo('');
	});

	function navigateToMyFav() {
		//var myUserLink = element(by.css('a.logged-user-dropdown')).click();
		browser.actions().mouseMove(element(by.css('a.logged-user-dropdown')), {x: 0, y: 0}).perform();
		var topMenuLink = element.all(by.css('ul.dropdown>li')).get(0).element(by.css('a.ng-binding'));
		topMenuLink.click();
		browser.waitForAngular();

		var profileBubble = element(by.css('span.shadow.large>a'));
		profileBubble.click();
		browser.waitForAngular();

		var myFavLink = element.all(by.css('div.bottom-tabs>ul>li')).get(1).element(by.css('a'));
		myFavLink.click();
		browser.waitForAngular();
	}

	it('should be able to make a bookmark on marketplace', function() {
		
		var elAll = element.all(by.className('item-common')).get(0);
		var expectedDropdown = elAll.element(by.css('ul.actions-dropdown'));
		var dropdownBookmarkLink = elAll.all(by.css('ul.actions-dropdown a')).get(0);
		var dropdownArrow = elAll.element(by.css('span.action-dropdown'));
		var notify = element(by.css('#notify-top>.alert-box'));


		expect(notify.isPresent()).toBeFalsy();
		expect(expectedDropdown.isDisplayed()).toBeFalsy();
		dropdownArrow.click();
		expect(expectedDropdown.isDisplayed()).toBeTruthy();
		dropdownBookmarkLink.click();
		browser.sleep(500);
		expect(notify.isPresent()).toBeTruthy();
	});


	it('should be able to make a bookmark on post detail', function() {
		
		var elAll = element.all(by.className('item-common')).get(3);
		var postDetailLink = elAll.element(by.css('h1>a'));

		var elPostDetail = element(by.css('.main-container>.item-common'));
		var dropdownBookmarkLink = elPostDetail.all(by.css('ul.actions-dropdown a')).get(0);
		var dropdownArrow = elPostDetail.element(by.css('span.action-dropdown'));
		var notify = element(by.css('#notify-top>.alert-box'));

		expect(notify.isPresent()).toBeFalsy();
		postDetailLink.click().then(function () {
			// on post detail
			dropdownArrow.click();
			dropdownBookmarkLink.click();
			browser.sleep(500);
			expect(notify.isPresent()).toBeTruthy();
		});
	});

	it('should be able to go to profile and see bookmarked items', function() {
		// navigate to profile through top menu
		navigateToMyFav();

		var marketItems = element.all(by.className('item-common'));
		expect(marketItems.count()).toBe(2); // count items

	});

	it('should be able to remove bookmarked items from profile', function() {
		navigateToMyFav();

		var elAll = element.all(by.className('item-common')).get(0);
		var expectedDropdown = elAll.element(by.css('ul.actions-dropdown'));
		var dropdownBookmarkLink = elAll.all(by.css('ul.actions-dropdown a')).get(0);
		var dropdownArrow = elAll.element(by.css('span.action-dropdown'))
		var notify = element(by.css('#notify-top>.alert-box'))
		var marketItems = element.all(by.className('item-common'));

		expect(marketItems.count()).toBe(2); // count items

		expect(notify.isPresent()).toBeFalsy();
		expect(expectedDropdown.isDisplayed()).toBeFalsy();
		dropdownArrow.click();
		expect(expectedDropdown.isDisplayed()).toBeTruthy();
		dropdownBookmarkLink.click();
		browser.sleep(500);
		expect(notify.isPresent()).toBeTruthy();

		expect(marketItems.count()).toBe(1); // count items
	});
});
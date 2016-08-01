var randomNumber = protractor.helpers.getRandomInt(100, 999);


describe('user profile', function() {

	beforeEach(function() {
		navigateToMyProfile();
	});

	function navigateToMyProfile() {
		browser.actions().mouseMove(element(by.css('a.logged-user-dropdown')), {x: 0, y: 0}).perform();
		var topMenuLink = element.all(by.css('ul.dropdown>li')).get(0).element(by.css('a.ng-binding'));
		topMenuLink.click();
		browser.waitForAngular();
	}

	function navigateToEditProfile() {
		// go to profile-edit
		var profileEditButton = element(by.css('.button-bar a[href=profile-edit]'));
		profileEditButton.click();
		browser.waitForAngular();
	}

	it('should see bubbles and profile image ', function() {
		var bubbles = element.all(by.className('bubble'));
		expect(bubbles.count()).toBe(4); // four bubbles there are
	});


	function setInputField(input, value, textarea = false) {
		var el = element(by.css('#profileEditForm ' + (textarea ? 'textarea' : 'input') + '[name='+ input +']'));
		el.clear();
		el.sendKeys(value);
	}


	function assertInputField(input, value, textarea = false) {
		var el = element(by.css('#profileEditForm ' + (textarea ? 'textarea' : 'input') + '[name='+ input +']'));
		el.getAttribute('value').then(function(gotvalue){
    		expect(value).toBe(gotvalue);
		});
	}


	function addTagToInput(input, value, downArrow = false) {
		var el = element(by.css('#profileEditForm '+ input +' .tags>input')); // pls ensure that input is in form of css selector
		el.sendKeys(value);
		browser.sleep(1000);
		if (downArrow == true) {
			el.sendKeys(protractor.Key.ARROW_DOWN);
		}
		el.sendKeys(protractor.Key.ENTER);
	}

	it('should be able to change basic user info', function() {	
		navigateToEditProfile();

		// basic info
		setInputField('first_name', 'Jmeno_' + randomNumber);
		setInputField('last_name', 'Prijmeni_' + randomNumber);
		setInputField('my_work', 'Job_' + randomNumber);

		var submitButton = element(by.css('#profileEditForm button[type=submit]'));
		submitButton.click();
	});


	it('should be able to change advanced user info', function() {	
		navigateToEditProfile();

		// about and interests
		setInputField('about', 'About_' + randomNumber, true); // textarea
		addTagToInput('.interests #interests', 'sport');
		addTagToInput('.interests #interests', 'penize');

		// locality
		addTagToInput('.location-input', 'kralupy nad vltavou', true);
		browser.sleep(500);
		addTagToInput('.location-input', 'nadrazni 740/56', true);

		var submitButton = element(by.css('#profileEditForm button[type=submit]'));
		submitButton.click();
	});

	it('should be able to change contact and networks info', function() {	
		navigateToEditProfile();

		// contact
		setInputField('phone', '+420777' + randomNumber + '' + randomNumber);

		// social networks
		element.all(by.css('#profileEditForm .social input[type=url]')).get(0).clear().sendKeys('http://facebook.com/profile' + randomNumber);
		element.all(by.css('#profileEditForm .social input[type=url]')).get(1).clear().sendKeys('http://twitter.com/profile' + randomNumber);
		element.all(by.css('#profileEditForm .social input[type=url]')).get(2).clear().sendKeys('http://linkedin.com/profile' + randomNumber);
		element.all(by.css('#profileEditForm .social input[type=url]')).get(3).clear().sendKeys('http://plus.google.com/profile' + randomNumber);
		
		// webs and internets
		element.all(by.css('#profileEditForm .webs input[type=url]')).get(0).clear().sendKeys('http://profile' + randomNumber + '.com');
		element(by.css('#profileEditForm .webs a')).click();
		element.all(by.css('#profileEditForm .webs input[type=url]')).get(1).clear().sendKeys('http://another.profile' + randomNumber + '.com');

		var submitButton = element(by.css('#profileEditForm button[type=submit]'));
		submitButton.click();
	});


	it('should be saved fine', function() {
		navigateToEditProfile();
		assertInputField('first_name', 'Jmeno_' + randomNumber);
		assertInputField('last_name', 'Prijmeni_' + randomNumber);
		assertInputField('my_work', 'Job_' + randomNumber);
		assertInputField('about', 'About_' + randomNumber, true); // textarea
	});

/*

	it('should be able to remove bookmarked items from profile', function() {
		navigateToMyFav();

		var elAll = element.all(by.className('item-common')).get(0);
		var expectedDropdown = elAll.element(by.css('ul.actions-dropdown'));
		var dropdownBookmarkLink = elAll.element(by.css('[test-beacon="marketplace-item-remove-bookmark"]'));
		var dropdownArrow = elAll.element(by.css('[test-beacon="marketplace-item-dropdown-toggle"]'));
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
	});*/
});

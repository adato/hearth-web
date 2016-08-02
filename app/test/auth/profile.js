var randomNumber = protractor.helpers.getRandomInt(100, 999);


describe('user profile', function() {

	beforeEach(function() {
		navigateToEditProfile();
	});

	function log(str) {
		console.log(str);
	}

	function navigateToMyProfile() {
		browser.actions().mouseMove(element(by.css('a.logged-user-dropdown')), {x: 0, y: 0}).perform();
		browser.sleep(500);
		var topMenuLink = element.all(by.css('ul.dropdown>li')).get(0).element(by.css('a.ng-binding'));
		topMenuLink.click().then(function () {
			browser.waitForAngular();
			browser.sleep(500);
		});
	}

	function navigateToEditProfile() {
		// go to profile-edit
		browser.actions().mouseMove(element(by.css('a.logged-user-dropdown')), {x: 0, y: 0}).perform();
		browser.sleep(500);
		var topMenuLink = element.all(by.css('ul.dropdown>li')).get(1).element(by.css('a.ng-binding'));
		topMenuLink.click().then(function () {
				browser.waitForAngular();
				browser.sleep(500);

		});
	}

	function setInputField(input, value, textarea = false) {
		log("setInputField (" + input + ") = " + value);
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
		log("addTagToInput (" + input + ") = " + value);
		var el = element(by.css('#profileEditForm '+ input +' .tags>input')); // pls ensure that $input is in form of css selector
		el.sendKeys(value);
		browser.sleep(1000);
		if (downArrow == true) {
			el.sendKeys(protractor.Key.ARROW_DOWN);
		}
		el.sendKeys(protractor.Key.ENTER);
	}

	function clearTagInput(input) {
		log("clearTagInput (" + input + ")");
		var el = element(by.css('#profileEditForm '+ input +' .tags>input')); // pls ensure that $input is in form of css selector
		el.click().then(function () {
			el.sendKeys(protractor.Key.BACK_SPACE);
			el.sendKeys(protractor.Key.BACK_SPACE);
			el.sendKeys(protractor.Key.BACK_SPACE);
			el.sendKeys(protractor.Key.BACK_SPACE);
		});
	}



	it('should be able to save minimal profile info and clear the rest', function() {	
		//navigateToEditProfile();

		setInputField('my_work', '');
		setInputField('phone', '');
		setInputField('about', '', true); // textarea

		clearTagInput('.interests #interests');
		clearTagInput('.location-input');
		clearTagInput('section.languages');

		element.all(by.css('#profileEditForm .social input[type=url]')).get(0).clear();
		element.all(by.css('#profileEditForm .social input[type=url]')).get(1).clear();
		element.all(by.css('#profileEditForm .social input[type=url]')).get(2).clear();
		element.all(by.css('#profileEditForm .social input[type=url]')).get(3).clear();
		
		element.all(by.css('#profileEditForm .webs input[type=url]')).get(0).clear();
		element(by.css('#profileEditForm .webs a')).click();
		element.all(by.css('#profileEditForm .webs input[type=url]')).get(1).clear();

		var submitButton = element(by.css('#profileEditForm button[type=submit]'));
		submitButton.click().then(function() {
			//... 
			browser.sleep(500);
			return true;
		});
	});


	it('should be able to change basic user info', function() {	
		//navigateToEditProfile();

		// basic info
		setInputField('first_name', 'Jmeno_' + randomNumber);
		setInputField('last_name', 'Prijmeni_' + randomNumber);
		setInputField('my_work', 'Job_' + randomNumber);

		var submitButton = element(by.css('#profileEditForm button[type=submit]'));
		submitButton.click().then(function() {
			browser.sleep(500);
			return true;
		});
	});


	it('should be able to change advanced user info', function() {	
		browser.sleep(1000); // let it init all
		// about and interests
		setInputField('about', 'About_' + randomNumber, true); // textarea
		addTagToInput('.interests #interests', 'sport');
		addTagToInput('.interests #interests', 'penize');

		// locality
		addTagToInput('.location-input', 'kralupy nad vltavou', true);
		browser.sleep(200);
		addTagToInput('.location-input', 'nadrazni 740/56', true);
		browser.sleep(200);
		// adding languages, which are localised, thus we must know our language or type language-agnostic words :)
		addTagToInput('section.languages', 'espe'); // esperanto
		addTagToInput('section.languages', 'rus'); // rusky or russian
		addTagToInput('section.languages', 'portu'); // portugalsky or portugese


		var submitButton = element(by.css('#profileEditForm button[type=submit]'));
		submitButton.click().then(function() {
			//... 
			browser.sleep(500);
			return true;
		});
	});

	it('should be able to change contact and networks info', function() {	
		//navigateToEditProfile();

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
		submitButton.click().then(function() {
			//... 
			browser.sleep(500);
			return true;
		});
	});


	it('all should be saved fine', function() {
		//navigateToEditProfile();
		assertInputField('first_name', 'Jmeno_' + randomNumber);
		assertInputField('last_name', 'Prijmeni_' + randomNumber);
		assertInputField('my_work', 'Job_' + randomNumber);
		assertInputField('about', 'About_' + randomNumber, true); // textarea

		element.all(by.css('#profileEditForm .social input[type=url]')).get(0).getAttribute('value').then(function(gotvalue){
    		expect(gotvalue).toBe('http://facebook.com/profile' + randomNumber);
		});
		element.all(by.css('#profileEditForm .social input[type=url]')).get(1).getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://twitter.com/profile' + randomNumber);
		});
		element.all(by.css('#profileEditForm .social input[type=url]')).get(2).getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://linkedin.com/profile' + randomNumber);
		});
		element.all(by.css('#profileEditForm .social input[type=url]')).get(3).getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://plus.google.com/profile' + randomNumber);
		});

		element.all(by.css('#profileEditForm .webs input[type=url]')).get(0).getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://profile' + randomNumber + '.com');
		});
		element.all(by.css('#profileEditForm .webs input[type=url]')).get(1).getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://another.profile' + randomNumber + '.com');
		});
	});
});

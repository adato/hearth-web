var randomNumber = protractor.helpers.getRandomInt(100, 999);


describe('user profile', function() {

	beforeEach(function() {
		navigateToEditProfile();
		browser.sleep(1000); // let it init all
	});

	var logs = [];

	function log(str) {
		//console.log("\n" + str);
		logs.push(str);
	}

	function flushLogs() {
		console.log(logs.join("\n"));
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

	function setInputField(input, value, textarea) {
		log("setInputField (" + input + ") = " + value);
		browser.sleep(200);
		var el = element(by.css('#profileEditForm ' + (textarea ? 'textarea' : 'input') + '[name='+ input +']'));
		el.clear();
		el.sendKeys(value);
	}


	function assertInputField(input, value, textarea) {
		var el = element(by.css('#profileEditForm ' + (textarea ? 'textarea' : 'input') + '[name='+ input +']'));
		el.getAttribute('value').then(function(gotvalue){
    		expect(value).toBe(gotvalue);
		});
	}


	function addTagToInput(input, value, downArrow) {
		log("addTagToInput (" + input + ") = " + value);
		var el = element(by.css('#profileEditForm '+ input +' .tags>input')); // pls ensure that $input is in form of css selector
		el.sendKeys(value);
		browser.sleep(1000);
		if (downArrow == true) {
			return el.sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ENTER);
		} else {
			return el.sendKeys(protractor.Key.ENTER);
		}
		
	}

	function clearTagInput(input) {
		log("clearTagInput (" + input + ")");
		var el = element(by.css('#profileEditForm '+ input +' .tags>input')); // pls ensure that $input is in form of css selector
		el.click().then(function () {
			for (var i = 0; i < 20; i++) {
				el.sendKeys(protractor.Key.BACK_SPACE); // send more backspaces then we need to clear old entries
			}
		});
	}

	function assertTagInputItemCount(input, value) {
		log("assertTagInput len(" + input + ") ?= " + value);
		var els = element.all(by.css('#profileEditForm '+ input +' .tags>ul.tag-list>li')); // pls ensure that $input is in form of css selector
		expect(els.count()).toBe(value);
	}

	function clickSubmitButton(callback) {
		var submitButton = element(by.css('#profileEditForm button[type=submit]'));
		submitButton.click().then(function() {
			browser.waitForAngular();
			browser.sleep(500);
			
			// there is success bar shown after submit
			var successBar = element(by.css('#notify-top .alert-box.success'));
			expect(successBar.isPresent()).toBeTruthy(); 

			return (typeof callback == 'function' ? callback() : true);
		});		
	}


	it('should be able to change basic user info', function() {	
		//navigateToEditProfile();

		// basic info
		setInputField('first_name', 'Jmeno_' + randomNumber);
		setInputField('last_name', 'Prijmeni_' + randomNumber);
		setInputField('my_work', 'Job_' + randomNumber);

		clickSubmitButton();
	});


	it('should be able to change about', function() {	
		// about 
		setInputField('about', 'About_' + randomNumber, true); // textarea

		clickSubmitButton();
	});

	it('should be able to change interests', function () {
		clearTagInput('.interests #interests');
		addTagToInput('.interests #interests', 'sport');
		addTagToInput('.interests #interests', 'pes');
		addTagToInput('.interests #interests', 'jazyky');
		addTagToInput('.interests #interests', 'cestovani');

		clickSubmitButton();
	});

	it('should be able to change localities', function () {
		// locality
		clearTagInput('.location-input');
		addTagToInput('.location-input', 'kralupy nad vltavou', true);
		browser.sleep(200);
		addTagToInput('.location-input', 'nadrazni 740/56', true);
		browser.sleep(200);
		// adding languages, which are localised, thus we must know our language or type language-agnostic words :)

		clickSubmitButton();
	});

	it('should be able to change languages', function () {
		// languages
		clearTagInput('section.languages');
		addTagToInput('section.languages', 'espe'); // esperanto
		browser.sleep(200);
		addTagToInput('section.languages', 'rus'); // rusky or russian
		browser.sleep(200);
		addTagToInput('section.languages', 'portu'); // portugalsky or portugese
		browser.sleep(200);

		clickSubmitButton();
	});

	it('should be able to change phone', function() {	
		// contact
		setInputField('phone', '+420777' + randomNumber + '' + randomNumber);

		clickSubmitButton();
	});


	it('should be able to change networks info', function() {	

		// social networks
		element.all(by.css('#profileEditForm .social input[type=url]')).get(0).clear().sendKeys('http://facebook.com/profile' + randomNumber);
		element.all(by.css('#profileEditForm .social input[type=url]')).get(1).clear().sendKeys('http://twitter.com/profile' + randomNumber);
		element.all(by.css('#profileEditForm .social input[type=url]')).get(2).clear().sendKeys('http://linkedin.com/profile' + randomNumber);
		element.all(by.css('#profileEditForm .social input[type=url]')).get(3).clear().sendKeys('http://plus.google.com/profile' + randomNumber);
		
		clickSubmitButton();
	});


	it('should be able to change user webs', function() {	

		// webs and internets
		element.all(by.css('#profileEditForm .webs input[type=url]')).get(0).clear().sendKeys('http://profile' + randomNumber + '.com');
		element(by.css('#profileEditForm .webs a')).click();
		element.all(by.css('#profileEditForm .webs input[type=url]')).get(1).clear().sendKeys('http://another.profile' + randomNumber + '.com');

		clickSubmitButton();
	});	


	it('all should be saved fine', function() {

		assertInputField('first_name', 'Jmeno_' + randomNumber);
		assertInputField('last_name', 'Prijmeni_' + randomNumber);
		assertInputField('my_work', 'Job_' + randomNumber);
		assertInputField('about', 'About_' + randomNumber, true); // textarea
		assertInputField('phone', '+420 777 ' + randomNumber + ' ' + randomNumber);

		assertTagInputItemCount('.location-input', 2); // expect tag-input length to be 2 
		assertTagInputItemCount('.interests #interests', 4); 
		assertTagInputItemCount('section.languages', 3);


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



	it('should be able to save minimal profile info and clear the rest', function() {	

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

		clickSubmitButton();
	});

	it('should be last test in order', function () {
		flushLogs();
	})	
});

var randomNumber = protractor.helpers.getRandomInt(100, 999);
var beacon = require('../utils.js').beacon;

describe('user profile', function() {

  beforeAll(function() {
    protractor.helpers.login();
  });

	beforeEach(function() {
		navigateToEditProfile();
	});

	var logs = [];

	function log(str) {
		logs.push(str);
	}

	function navigateToMyProfile() {
		browser.actions().mouseMove(beacon('logged-user-dropdown'), {x: 0, y: 0}).perform();
		beacon('dropdown-my-profile').click();
	}

	function navigateToEditProfile() {
		// go to profile-edit
		browser.actions().mouseMove(beacon('logged-user-dropdown'), {x: 0, y: 0}).perform();
		browser.sleep(500);
		beacon('dropdown-edit-profile').click();
	}

	function setInputField(input, value, textarea) {
		log("setInputField (" + input + ") = " + value);
		browser.sleep(200);
		var el = element(by.css('[test-beacon="profile-edit-form"] ' + (textarea ? 'textarea' : 'input') + '[name='+ input +']'));
		el.clear();
		el.sendKeys(value);
	}


	function assertInputField(input, value, textarea) {
		var el = element(by.css('[test-beacon="profile-edit-form"] ' + (textarea ? 'textarea' : 'input') + '[name='+ input +']'));
		el.getAttribute('value').then(function(gotvalue) {
    		expect(value).toBe(gotvalue);
		});
	}


	function addTagToInput(input, value, downArrow) {
		log("addTagToInput (" + input + ") = " + value);
		var el = element(by.css('[test-beacon="profile-edit-form"] '+ input +' .tags>input')); // pls ensure that $input is in form of css selector
		el.sendKeys(value);
		browser.sleep(1000);
		if (downArrow == true) {
			return el.sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ENTER);
		} else {
			return el.sendKeys(protractor.Key.ENTER);
		}
	}


	/// SELECT2 COMPONENT
	function addTagToSelect2Input(input, value, downArrow) {
		log("addTagToS2Input (" + input + ") = " + value);
		var el = element(by.css('[test-beacon="profile-edit-form"] '+ input +' ul li>input')); // pls ensure that $input is in form of css selector
		el.sendKeys(value);
		browser.sleep(1000);
		if (downArrow == true) {
			return el.sendKeys(protractor.Key.ARROW_DOWN).sendKeys(protractor.Key.ENTER);
		} else {
			return el.sendKeys(protractor.Key.ENTER);
		}
	}

	function clearSelect2TagInput(input) {
		log("clearS2TagInput (" + input + ")");
		var el = element(by.css('[test-beacon="profile-edit-form"] '+ input +' ul li>input')); // pls ensure that $input is in form of css selector
		el.click().then(function() {
			for (var i = 0; i < 20; i++) {
				el.sendKeys(protractor.Key.BACK_SPACE); // send more backspaces then we need to clear old entries
			}
		});
	}

	function assertSelect2TagInputItemCount(input, value) {
		log("assertS2TagInput len(" + input + ") ?= " + value);
		var els = element.all(by.css('[test-beacon="profile-edit-form"] ' + input + ' ul.select2-choices li.ui-select-match-item')); // pls ensure that $input is in form of css selector
		expect(els.count()).toBe(value);
	}
	// END OF SELECT2

	function clearTagInput(input) {
		log("clearTagInput (" + input + ")");
		var el = element(by.css('[test-beacon="profile-edit-form"] '+ input +' .tags>input')); // pls ensure that $input is in form of css selector
		el.click().then(function() {
			for (var i = 0; i < 20; i++) {
				el.sendKeys(protractor.Key.BACK_SPACE); // send more backspaces then we need to clear old entries
			}
		});
	}

	function assertTagInputItemCount(input, value) {
		log("assertTagInput len(" + input + ") ?= " + value);
		var els = element.all(by.css('[test-beacon="profile-edit-form"] ' + input + ' .tags > ul.tag-list > li')); // pls ensure that $input is in form of css selector
		expect(els.count()).toBe(value);
	}

	function clickSubmitButton(callback) {
		var submitButton = element(by.css('[test-beacon="profile-edit-form"] button[type=submit]'));
    submitButton.click().then(function () {
      browser.sleep(500);

      // there is success bar shown after submit
      var successBar = element(by.css('#notify-top .alert-box.success'));

      // Usually display the notification can take some times
      var isPresent = false;
      var i = 0;
      while (i < 10) {
        if (successBar.isPresent()) {
          isPresent = true;
          i = 10;
        } else {
          browser.sleep(300);
        }
        i++;
      }

      expect(isPresent).toBeTruthy();

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
		clearTagInput('[test-beacon="interests-tags-input"]');
		addTagToInput('[test-beacon="interests-tags-input"]', 'sport');
		addTagToInput('[test-beacon="interests-tags-input"]', 'pes');
		addTagToInput('[test-beacon="interests-tags-input"]', 'jazyky');
		addTagToInput('[test-beacon="interests-tags-input"]', 'cestovani');

		clickSubmitButton();
	});

	it('should be able to change localities', function () {
		// locality
		clearTagInput('[test-beacon="location-input-wrapper"]');
		addTagToInput('[test-beacon="location-input-wrapper"]', 'kralupy nad vltavou', true);
		browser.sleep(500);
		addTagToInput('[test-beacon="location-input-wrapper"]', 'nadrazni 740/56', true);
		browser.sleep(500);
		// adding languages, which are localised, thus we must know our language or type language-agnostic words :)

		clickSubmitButton();
	});

	it('should be able to change languages', function () {
		// languages
    	const LANG_SELECTOR = 'language-section';
    	const LANG_INPUT = beacon(LANG_SELECTOR);

		clearSelect2TagInput('[test-beacon="language-section"]');
		addTagToSelect2Input('[test-beacon="language-section"]', 'ngl'); // eng
		browser.sleep(200);
		addTagToSelect2Input('[test-beacon="language-section"]', 'rus'); // rusky or russian
		browser.sleep(200);
		addTagToSelect2Input('[test-beacon="language-section"]', 'portu'); // portugalsky or portugese
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
    beacon('social-fb').clear().sendKeys('http://facebook.com/profile' + randomNumber);
		beacon('social-twitter').clear().sendKeys('http://twitter.com/profile' + randomNumber);
		beacon('social-linkedin').clear().sendKeys('http://linkedin.com/profile' + randomNumber);
		beacon('social-gplus').clear().sendKeys('http://plus.google.com/profile' + randomNumber);

		clickSubmitButton();
	});


	it('should be able to change user webs', function() {

		// webs and internets
		element.all(by.css('[test-beacon="web-input"]')).get(0).clear().sendKeys('http://profile' + randomNumber + '.com');
		beacon('web-adder').click();
		element.all(by.css('[test-beacon="web-input"]')).get(1).clear().sendKeys('http://another.profile' + randomNumber + '.com');

		clickSubmitButton();
	});


	it('all should be saved fine', function() {
		assertInputField('first_name', 'Jmeno_' + randomNumber);
		assertInputField('last_name', 'Prijmeni_' + randomNumber);
		assertInputField('my_work', 'Job_' + randomNumber);
		assertInputField('about', 'About_' + randomNumber, true); // textarea
		assertInputField('phone', '+420 777 ' + randomNumber + ' ' + randomNumber);

		assertTagInputItemCount('[test-beacon="location-input-wrapper"]', 2); // expect tag-input length to be 2
		assertTagInputItemCount('[test-beacon="interests-tags-input"]', 4);
		assertSelect2TagInputItemCount('[test-beacon="language-section"]', 3);


		beacon('social-fb').getAttribute('value').then(function(gotvalue){
    		expect(gotvalue).toBe('http://facebook.com/profile' + randomNumber);
		});
		beacon('social-twitter').getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://twitter.com/profile' + randomNumber);
		});
		beacon('social-linkedin').getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://linkedin.com/profile' + randomNumber);
		});
		beacon('social-gplus').getAttribute('value').then(function(gotvalue){
			expect(gotvalue).toBe('http://plus.google.com/profile' + randomNumber);
		});

		element.all(by.css('[test-beacon="web-input"]')).get(0).getAttribute('value').then(gotvalue => {
			expect(gotvalue).toBe('http://profile' + randomNumber + '.com');
		});
		element.all(by.css('[test-beacon="web-input"]')).get(1).getAttribute('value').then(gotvalue => {
			expect(gotvalue).toBe('http://another.profile' + randomNumber + '.com');
		});
	});



	it('should be able to save minimal profile info and clear the rest', function() {

		setInputField('my_work', '');
		setInputField('phone', '');
		setInputField('about', '', true); // textarea

		clearTagInput('[test-beacon="interests-tags-input"]');
		clearTagInput('[test-beacon="location-input-wrapper"]');
		clearSelect2TagInput('[test-beacon="language-section"]');
		addTagToSelect2Input('[test-beacon="language-section"]', 'ang'); // add one language to pass a validation
		browser.sleep(200);

		beacon('social-fb').clear();
		beacon('social-twitter').clear();
		beacon('social-linkedin').clear();
		beacon('social-gplus').clear();

		element.all(by.css('[test-beacon="web-input"]')).get(0).clear();
		beacon('web-adder').click();
		element.all(by.css('[test-beacon="web-input"]')).get(1).clear();

		clickSubmitButton();
	});

});

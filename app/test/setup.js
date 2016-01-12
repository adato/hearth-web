exports.HearthApp = {
	options: { 
		useConfig: 'local',
		local: {
			baseUrl: 'https://127.0.0.1:9000/app',
			appPath: '/',
			loginName: 'hearth@mailinator.com', // test user email
			loginPassword: 'tester', 			// test user password
			loginFullName: 'E2E tester',
			loginTrimmedName: 'E2E teste…'
		},
		dev: {
			baseUrl: 'http://dev.hearth.net/app',
			appPath: '/',
			loginName: 'hearth@mailinator.com', // test user email
			loginPassword: 'tester', 			// test user password
			loginFullName: 'E2E tester',
			loginTrimmedName: 'E2E teste…'
		},
		stage: {
			baseUrl: 'http://stage.hearth.net/app',
			appPath: '/',
			loginName: 'hearth-staging@mailinator.com', // test user email
			loginPassword: 'tester', 		// test user password
			loginFullName: 'E2E tester',
			loginTrimmedName: 'E2E teste…'
		}
	},
	config: function () { 
		return this.options[browser.params.env];
	},
	login: function () {
		browser.manage().deleteAllCookies();
		this.navigateTo('login');
		element(by.model('data.username')).sendKeys(this.config().loginName);
		element(by.model('data.password')).sendKeys(this.config().loginPassword);
		element(by.css('button.button-send')).click();
		browser.driver.sleep(2000);
	},
	logout: function () {
		this.navigateTo('');
		this.hoverTopUserMenu();
		element(by.css('#profile-drop a[ng-click="logout()"]')).click();
	},
	hoverTopUserMenu: function () {
		browser
			.actions()
			.mouseMove(browser.findElement(protractor.By.css('.dropdown-container a[dropdown="#profile-drop"]:nth-child(1)')))
			.perform();
	},
	navigateTo: function (where) {
		// make protractor go to baseUrl with where param
		browser.get(this.config().baseUrl + '' + this.config().appPath + '' + where);
	},
	expectAlertBox: function (type) {
		expect(element(by.css('.alert-box.' + type )).isDisplayed()).toBe(true);
		browser.driver.sleep(3600);
		expect(element(by.css('.alert-box.' + type )).isPresent()).toBe(false);
	},
	hasClass: function (element, cls) {
		return element.getAttribute('class').then(function (classes) {
			return classes.split(' ').indexOf(cls) !== -1;
		});
	}
};
describe('logged user profile', function() {  

  
  it('should login and dismiss modal', function () {
  	protractor.helpers.HearthApp.login();
  	element(by.css('.modal span.close')).click();
  	browser.driver.sleep(1000);
  });

  it('should go to my profile after select in menu', function () {
  	protractor.helpers.HearthApp.hoverTopUserMenu();
  	element(by.css('.dropdown.user-dropdown li:nth-child(1) a')).click(); // click 1st menu item
	expect(browser.getCurrentUrl()).toContain('app/profile/');
	expect(element(by.css('h1>a>span')).getText()).toBe(protractor.helpers.HearthApp.config().loginFullName);
  });

  it('should go to edit profile after select in menu', function () {
  	protractor.helpers.HearthApp.hoverTopUserMenu();
  	element(by.css('.dropdown.user-dropdown li:nth-child(2) a')).click(); // click 2nd menu item
	expect(browser.getCurrentUrl()).toContain('app/profile-edit');
	expect(element(by.model('profile.name')).getAttribute('value')).toBe(protractor.helpers.HearthApp.config().loginFullName);
  });

  it('should be able to save profile', function () {
  	expect(browser.getCurrentUrl()).toContain('app/profile-edit');
	element(by.css('#profileEditForm button.button-send:nth-child(2)')).click(); // click on second submit (not unique class)
	expect(browser.getCurrentUrl()).toContain('app/profile/'); // i am redirected to profile
	protractor.helpers.HearthApp.expectAlertBox('success');
  });

  it('should go to profile settings after select in menu', function () {
  	protractor.helpers.HearthApp.hoverTopUserMenu();
  	element(by.css('.dropdown.user-dropdown li:nth-child(3) a')).click(); // click 3rd menu item
	expect(browser.getCurrentUrl()).toContain('app/profile-settings'); 
  });

  it('should logout at the end of a session', function () {
    protractor.helpers.HearthApp.logout();
  });

});
describe('logged user', function() {  

  it('should log in using default credentials', function () {
    protractor.helpers.login();
  });

  it('should see a tour modal and be able to dismiss it', function () {
    expect(element(by.css('section.tutorial')).isDisplayed()).toBe(true);
    element(by.css('.modal span.close')).click();
    expect(element(by.css('section.tutorial')).isDisplayed()).toBe(true);
  });

  it('should see username on top right', function () {
    expect(element(by.css('.dropdown-container a[dropdown="#profile-drop"]:nth-child(1)>label.ng-binding')).getText()).toBe(protractor.helpers.config().loginTrimmedName);
  });

  it('should see list of 15 posts', function () {
    expect(element.all(by.repeater('item in items')).count()).toBe(15);
  });
  
  it('should see modal dialog with textarea after click on first few items` buttons', function () { 
    element.all(by.repeater('item in items')).then(function(items) {
       items.forEach(function (item, key) {
         var buttonElement = item.element(by.css('button.small'));
         if (!buttonElement || key >= 5) return; // skip if it doesnt exists
         buttonElement.click().then(function() {
            browser.driver.sleep(200);
            expect(element(by.css('.itemReply.modal')).isDisplayed()).toBe(true);
            element(by.css('.itemReply.itemEdit.modal .fleft.close')).click();
            browser.driver.sleep(500);
         })
       });
    });
  });

  it('should see create/edit dialog after "create new" click', function () {
    var createButton = element(by.css('.insert-button-container>a.button'));
    createButton.click();
    expect(element(by.css('.itemEdit.modal')).isDisplayed()).toBe(true);
    element(by.css('.itemEdit.modal a.fleft.close')).click();
    browser.driver.sleep(500);
    expect(element(by.css('.itemEdit.modal')).isPresent()).toBe(false);
  });


  it('should logout at the end of a session', function () {
    protractor.helpers.logout();
    browser.driver.sleep(2000);
    expect(element(by.css('.dropdown-container a[dropdown="#profile-drop"]:nth-child(1)>label.ng-binding')).getText()).toBe('');
  });

});
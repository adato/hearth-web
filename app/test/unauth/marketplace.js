var EC = protractor.ExpectedConditions;

describe('hearth unauth maretplace', function() {  

  beforeEach(function() {
  	protractor.helpers.HearthApp.navigateTo('', function () { 
      browser.waitForAngular(); 
    });
  });

  it('should see top main menu with logo, searchform and buttons', function () {
    expect(element(by.id('navigation')).isDisplayed()).toBeTruthy();
  });

  it('should see list of 15 posts', function () {
    expect(element.all(by.repeater('item in items')).count()).toBe(15);

    browser.executeScript('window.scrollTo(0,20000);').then(function () {
      browser.sleep(2000);
      expect(element.all(by.repeater('item in items')).count()).toBe(15);
    })
  });

  it('should be able to switch to map', function () {
    expect(element(by.css('div.map .map-canvas')).isPresent()).toBe(false);
    element(by.css('.filter-button-container>a:nth-child(3)')).click();
    expect(element(by.css('div.map .map-canvas')).isPresent()).toBe(true);
    element(by.css('.filter-button-container>a:nth-child(3)')).click();
  });
  

  it('should see login dialog after "create new" click', function () {
    var createButton = element(by.css('.insert-button-container>a.button'));
    createButton.click();
    expect(element(by.css('.register-login-dialog .alert-box.alert')).isDisplayed()).toBe(true);
  });

  it('should see login screen after login click', function () {
    element(by.id('nav-login')).click().then(function () {
      expect(browser.getCurrentUrl()).toContain('app/login');
    });
  });

  it('should see login dialog after "give" or "take" click', function () {
    element.all(by.repeater('item in items')).then(function(items) {
       var buttonElement = items[0].element(by.css('button.reply-button'));
       browser.wait(EC.elementToBeClickable(buttonElement), 10000);
       buttonElement.click().then(function() {
          expect(element(by.css('.register-login-dialog')).isDisplayed()).toBe(true);
       })
    });
  });

  it('should be able to go to post detail', function () {
    var titleElement = element.all(by.repeater('item in items')).first().element(by.css('h1>a'));
    browser.wait(EC.elementToBeClickable(titleElement), 10000);
      
    titleElement.click().then(function() {
      expect(element(by.css('article#item-detail')).isPresent()).toBe(true);
    })
  });

});
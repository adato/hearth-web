describe('hearth various', function() {  

  it('should see an 404 page on wrong request', function () {
    protractor.helpers.HearthApp.navigateTo('befelemepeseveze');

    expect(element(by.css('h1>big')).getText()).toBe('404');
    expect(element(by.css('.page-not-found img')).isDisplayed()).toBe(true);
  });


  it('should be able to fill in feedback text', function () {
    protractor.helpers.HearthApp.navigateTo('feedback');
    var textarea = element(by.model('feedback.text'));
    var emailInput = element(by.model('feedback.email'));

    expect(textarea.isPresent()).toBe(true);
    textarea.sendKeys('testovaci input');

    expect(emailInput.getText()).toBe('');
    emailInput.sendKeys('testovaci', protractor.Key.TAB);
    expect(element(by.css("button.button-send")).getAttribute("disabled")).toBe('true');

    emailInput.clear();
    emailInput.sendKeys('testovaci@email.com', protractor.Key.TAB);
    expect(element(by.css("button.button-send")).getAttribute("disabled")).toBe(null);
  });

});
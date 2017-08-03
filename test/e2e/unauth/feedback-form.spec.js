const beacon = require('../utils.js').beacon;

describe('hearth support form', function () {

  function navigateToFeedback() {
    browser.actions().mouseMove(beacon('hearth-project-dropdown'), {x: 0, y: 0}).perform();
    var topMenuLink = beacon('hearth-contact-us-link');
    topMenuLink.click();
  }

  beforeEach(function () {
    protractor.helpers.navigateTo('/');
  });


  // should be able to go to feedback from main page
  it('should be able to navigate to feedback', function () {
    navigateToFeedback();

    var feedbackForm = beacon('hearth-feedback-form');
    expect(feedbackForm.isDisplayed()).toBeTruthy();
  });


  // should fill the form and send it
  it('should be able to fill the form', function () {
    navigateToFeedback();

    var feedbackForm = beacon('hearth-feedback-form');
    var feedbackTextarea = feedbackForm.element(by.css('textarea'));
    var feedbackEmailInput = feedbackForm.element(by.css('input[type="email"]'));
    var submitButton = feedbackForm.element(by.css('button[type="submit"]'));
    var successfullMessage = beacon('hearth-feedback-success');

    expect(feedbackForm.isDisplayed()).toBeTruthy();
    expect(successfullMessage.isDisplayed()).toBeFalsy();
    expect(feedbackTextarea.isDisplayed()).toBeTruthy();
    expect(submitButton.getAttribute('disabled')).toBe('true');

    feedbackTextarea.sendKeys("$1bf6cc4c\r\nToto je generovaná zpráva z automatizovaných testů, neodpovídejte na ní.");
    feedbackEmailInput.sendKeys("testovaci@mailinator.com");

    expect(submitButton.getAttribute('disabled')).toBe(null);    

    submitButton.click().then(function () {
      expect(feedbackForm.isDisplayed()).toBeFalsy();
      expect(successfullMessage.isDisplayed()).toBeTruthy();
    });
    
  });


});

// var beacon = require('../utils.js').beacon;

describe('hearth login/logout', function () {

  // login itself
  it('should be able to login/logout user', function () {
    //login first
    protractor.helpers.login();

    var navigationMenu = element(by.css(".logged-user-dropdown"));
    expect(navigationMenu.isPresent()).toBeTruthy();

    // logout
    browser.actions().mouseMove(navigationMenu).perform();
    element(by.css("nav .logout-link")).click();

    browser.sleep(1000);
    var loginButton = element(by.id('nav-login'));
    expect(loginButton.isPresent()).toBeTruthy();
  });

  it('should not login with wrong credentials ', function () {
    protractor.helpers.navigateTo('login');
    element(by.model('data.username')).sendKeys("unauthorized-user65386255@not.here");
    element(by.model('data.password')).sendKeys("password");
    beacon('login-button').click();

    var errorMessage = element(by.css('p[test-beacon=login-bad-credentials]'));
    expect(errorMessage.isPresent()).toBeTruthy();
  });
});



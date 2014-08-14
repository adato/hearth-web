describe("Main app", function() {
  var helpers = null;
  beforeEach(function(){
    helpers = configHelpers(pause, sleep, browser, expect, using, binding, input, repeater, select, element);
  })


    describe("Logged user", function () {
        it('should reset page url', function() {
            browser().navigateTo('/app/#!/search');
        });

        it('should go to landing page and login', function() {
            helpers.loginTestuser();
            browser().navigateTo('/app/#!/search');
            expect(browser().location().path()).toBe("/search");
        });

        it('should go to my profile when logged in and clicked on profile link', function() {
            element('#nav-profile').click()
            expect(element("#nav-edit-profile:visible").count()).toBe(1);
        });

        it('should logout', function() {
            helpers.logout();
            expect(element("#nav-profile:visible").count()).toBe(0);
        });
    });

    describe("Anonymous user on landing page", function () {

        it('should go to landing page after typing url', function() {
            browser().navigateTo('/');
            expect(browser().location().path()).toBe("");
            expect(element("h1").text()).toBe("Hearth");
        });

        it('should see login form', function() {
            expect(element("form.email-login:visible").count()).toBe(1);
        });

        it('should see language list with two languages set', function() {
             expect(repeater('.lang-links ul li').count()).toEqual(2);
        });

        it('should see czech strings after clicking on czech', function() {
             element('.lang-links a:eq(1)').click();
             expect(element("h4.connect-with").text()).toBe('Přihlaste se');
        });

        it('should see english strings after clicking on english', function() {
             element('.lang-links a:eq(0)').click();
             expect(element("h4.connect-with").text()).toBe('Log in');
             element('.lang-links a:eq(1)').click(); // select czech again
        });

        it('should go to register form  after hitting create account link', function() {
            element('#nav-register').click();
            expect(browser().location().path()).toBe("/register");
            expect(element("h1:eq(1)").text()).toBe("Váš profil je už jen pár kliků odtud. Šup šup."); // todo translations
        });

        it('should go to login page after clicking on login link', function() {
            element('#nav-login').click();
            expect(browser().location().path()).toBe("/login");
            expect(element("h1:eq(1)").text()).toBe("Přihlaste se"); // todo translations
        });

        // market

        it('should go market after click on market button', function() {
            element('#nav-market').click();
            expect(browser().location().path()).toBe("/search");
        });

        it('should check whether "newest" is selected after click on "newest"', function() {
            element('.row.profile-links a:eq(0)').click();
            expect(element('.row.profile-links a:eq(0)').attr("class")).toEqual("underliner");
        });

        it('should load more items if scrolled down', function() {
            expect(repeater(".wish-list div.wish-container").count()).toBe(16); // default page size + not found

            element('body').scrollTop(5000)
            expect(repeater(".wish-list div.wish-container").count()).toBe(31); // default page size * 2 + not found
        });

        it('should expand post with login prompt', function() {
            element('.wish:eq(1)').click();
            expect(element('.round.login-prompt:visible').count()).toBe(1);
            expect(element('.login-prompt a[href="#/login"]:visible').count()).toBe(1);
        });

        // user profile

        it('should go to user profile after clicking on his name in right pane', function() {
            element('h1.username a').click();
            expect(browser().location().path()).toMatch(/profile/)
        });

        // market again

        it('should go market after click on market button again', function() {
            element('#nav-market').click();
            expect(browser().location().path()).toBe("/search");
        });

        it('should go to "nearest" tab and show input', function() {
            element('.row.profile-links a:eq(1)').click();
            expect(element('.row.profile-links a:eq(1)').attr("class")).toEqual("underliner");
            expect(element('input.location.text-input:visible').count()).toBe(1);
        });

        it('should go to "search" tab and show search form', function() {
            element('.row.profile-links a:eq(2)').click();
            expect(element('.row.profile-links a:eq(2)').attr("class")).toEqual("underliner");
            expect(element('form.search-form:visible').count()).toBe(1);
        });

        it('should try to search for demo and have some results', function() {
            input('srch.query').enter('test');
            element('form.search-form button[type="submit"]').click();
            expect(repeater(".wish-list div.wish-container").count()).toBeGreaterThan(1)
        });

        it('should try to search for unreal string and have 0 results', function() {
            input('srch.query').enter('zcddfg$#CQNH%^23xjfghxlkfgjhd');
            element('form.search-form button[type="submit"]').click();
            expect(repeater(".wish-list div.wish-container").count()).toBe(1)
        });

        it('should go to "create" tab and show you-need-to-be-logged-in string', function() {
            element('.row.profile-links a:eq(3)').click();
            expect(element('.row.profile-links a:eq(3)').attr("class")).toEqual("underliner");
            expect(element('.round.login-prompt:visible').count()).toBe(1);
            expect(element('.login-prompt a[href="#/login"]:visible').count()).toBe(1);
        });

    });

    describe("Feedback form", function () {

        it('should go to feedback', function() {
            element('#nav-feedback').click();
            expect(browser().location().path()).toBe("/feedback");
            expect(element("h1:eq(1)").text()).toBe("Váš názor"); // todo translations
        });

        it('should try to fill empty text and fail', function() {
            input('feedback.text').enter('');
            element('button[type=submit]').click();
            expect(element('textarea').prop('className')).toMatch(/ng\-invalid/);
        });
    });
});

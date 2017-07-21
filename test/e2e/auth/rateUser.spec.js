const beacon = require('../utils.js').beacon;

describe('hearth rate user', function () {
    beforeAll(function () {
	   protractor.helpers.login();
    });

    it('should see rating form when going via item detail', function () {
    	var elAll = element.all(by.className('item-common')).get(1);
    	var postDetailLink = elAll.element(by.css('h1>a'));

		var elPostDetail = element(by.css('.main-container>.item-common'));
        var avatar = beacon('item-detail-avatar');
        var profileRatingButton = beacon('profile-rating-button');
        var ratingForm = element(by.css('.ratings-received .rating-form .content'));
        var allGoodOption = element(by.css('.ratings-received .rating-form .content')).all(by.css('.ui-checkbox.radio')).get(0);
        var ratingSubmitButton = element(by.css('.ratings-received .rating-form .content')).element(by.css('button[type="submit"]'));
        var ratingTextarea = element(by.css('.ratings-received .rating-form .content')).element(by.css('textarea[name="text"]'));
        var firstRatingItem = element.all(by.css('.rating-listing article.rating-item')).get(0);
        var firstRatingItemDetail = firstRatingItem.element(by.css('.text-container>p'));
        var ratingText = "Hello user! This is a message from an automaton. I`m a simple testing bot and I just accidentaly tripped over your profile. So, yeah, you`re great, have a nice day!";

        // on market ..

		postDetailLink.click().then(function () {
			// on post detail
            expect(avatar.isPresent()).toBeTruthy();
            return avatar.click();

        }).then(function () {
            // on user detail
            expect(profileRatingButton.isPresent()).toBeTruthy();
            return profileRatingButton.click();

        }).then(function () {
            // on profile with rating form expanded
            expect(ratingForm.isPresent()).toBeTruthy();
            browser.sleep(1000);
            return allGoodOption.click();

        }).then(function () {
            // on rating form with positive rating selected
            expect(ratingSubmitButton.getAttribute('class')).toContain('positive');

            // fill some text
            ratingTextarea.sendKeys(ratingText);

            return ratingSubmitButton.click();
        }).then(function () {
            // on profile, just submitted rating
            expect(firstRatingItem.getInnerHtml()).toMatch(ratingText);
        });
    });

});

describe("Testing basic functionality for logged in user", function() {
	var helpers = null;
	beforeEach(function() {
		helpers = configHelpers(pause, sleep, browser, expect, using, binding, input, repeater, select, element);
	})

	describe('Login', function() {
		it('should be able to login as testuser', function() {
			helpers.loginTestuser();
			helpers.verifyIsLoggedIn();
		})
	});

	/*
	 todo: possible tests
	 * Click on market
	 * Listing by date
	 * Listing by distance
	 * Search
	 * Post reply
	 * Creating of new post
	 * Editing of existing post
	 * Deleting
	 * Click on My market
	 * Listing by date
	 * Listing by distance
	 * Search
	 * Post reply
	 * Creating of new post
	 * Editing of existing post
	 * Deleting
	 * Click on My profile
	 * Click on activity tab
	 * Editing of existing post
	 * Deleting
	 * Click on Ratings tab
	 * Creating new post
	 * Without image
	 * With image
	 * Offer
	 * Need
	 * Locality
	 * Editing custom profile
	 * Chaning name
	 * Changing desc
	 * Changing avatar
	 */

	describe('Global market', function() {
		it('should go market after click on market button', function() {
			element('#nav-market').click();
			expect(browser().location().path()).toBe("/search");
		});

		it('should check whether "newest" is selected after click on "newest"', function() {
			sleep(2);
			element('.row.profile-links a:eq(0)').click();
			expect(element('.row.profile-links a:eq(0)').attr("class")).toEqual("underliner");
		});

		it('should create 20 posts without any problem', function() {
			helpers.logout();
			helpers.loginTestuserSecond();
			for (var i = 0; i < 20; i++) {
				var postName = "Toto je testovaci nabídka " + i;
				helpers.createPost({
					name: postName
				});
				// our new post should be first
				pause();
				expect(repeater(".wish-list div.wish-container").row(0)).toEqual(["I can give", postName]);
			}
		});

		it('should load more items if scrolled down', function() {
			expect(repeater(".wish-list div.wish-container").count()).toBe(16); // default page size + not found
			element('body').scrollTop(5000)
			expect(repeater(".wish-list div.wish-container").count()).toBe(31); // default page size * 2 + not found
		});

		it('should expand post with reply form', function() {
			element('.wish:eq(1)').click();
			expect(element('form[name="replyForm"]').count()).toBe(1);
		});
	})

	describe('Logout', function() {
		it('should be able to logout the user after logging in', function() {
			helpers.logout();
			helpers.verifyIsNotLoggedIn();
		})
	});
});
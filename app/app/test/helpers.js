function configHelpers(pause, sleep, browser, expect, using, binding, input, repeater, select, element) {
	var users = [{
		email: 'test@hearth.net',
		password: 'aa'
	}, {
		email: 'test2@hearth.net',
		password: 'aa'
	}];
	return {
		login: function(email, password) {
			browser().navigateTo('/');
			sleep(1);
			input('credentials.username').enter(email);
			input('credentials.password').enter(password);
			element('.login-submit').click();
			sleep(1);
		},
		loginTestuser: function(index) {
			index = index || 0;
			this.login(users[index].email, users[index].password);
		},
		loginTestuserSecond: function() {
			this.loginTestuser(1);
		},
		ensureIsLoggedOut: function() {
			element('#nav-logout', 'Logout button').query(function(logoutbtn, done) {
				if (logoutbtn) {
					element('#nav-logout', 'Logout button').click();
				}
				done();
			});
		},
		logout: function() {
			element("#nav-logout", "Logout button").click();
			sleep(1);
		},
		verifyIsLoggedIn: function() {
			expect(element("#nav-logout", "Logout button").count()).toBe(1)
		},
		verifyIsNotLoggedIn: function() {
			expect(element("#nav-logout", "Logout button").count()).toBe(0)
		},
		createPost: function(post) {
			pause();
			element('#nav-profile').click();
			pause();
			element('textarea[name="name"]').click();
			input('post.name').enter(post.name);
			element('button.primary.right.button').click();
			sleep(3);
		}
	}
}
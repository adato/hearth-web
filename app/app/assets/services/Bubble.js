'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Bubble
 * @description Bubble functions
 *	Bubble placeholders should look like <div bubble-placeholder="feature"></div>
 */

angular.module('hearth.services').factory('Bubble', ['User', '$rootScope', 'Auth', '$analytics', '$state', '$compile', '$document', '$timeout', 'ViewportUtils',
	function(User, $rootScope, Auth, $analytics, $state, $compile, $document, $timeout, ViewportUtils) {

		var factory = {};
		factory.isInViewport = ViewportUtils.isInViewport;
		factory.CLOSE_REASONS = {
			'DOCUMENT_CLICK': 'document-click',
			'BUBBLE_CLICK': 'bubble-click',
			'BUTTON_CLICK': 'bubble-button-click'
		};

		/**
		 *	Bubble definitions
		 *	each bubble must have an 'applicable' function, which checks whether that bubble should be shown
		 *	and an 'apply' function which applies (sync-ly or async-ly) the bubble to the DOM by finally calling
		 *	the 'showBubble' function and supplying it with a DOM [bubble-placeholder] node replace and a template string.
		 *	The node shall be replaced by a bubble with a template from the bubble.template definition
		 */
		var bubbleDefinitions = {
			'hide-post': {
				applicable: function() {
					if (!($rootScope.loggedUser && $rootScope.loggedUser._id)) return false;
					var confirmedForMoreThanADay = (((new Date()).getTime() - new Date($rootScope.loggedUser.confirmed_at).getTime()) > 86400000);
					return (($rootScope.loggedUser.reminders.indexOf('hide_post') > -1) && confirmedForMoreThanADay);
				},
				apply: function() {
					var template = 'templates/directives/bubble/hide-post-option.html';
					var placeholder = bubblePlaceholderSearch({
						identificator: 'hide-post'
					});
					if (placeholder) showBubble({
						placeholder: placeholder,
						templateUrl: template,
						type: 'hide_post'
					});
				}
			},
			'bookmark-reminder': {
				applicable: function() {
					return false; // << current logical setup does not allow for this bubble to be shown in any situation

					if (!($rootScope.loggedUser && $rootScope.loggedUser._id)) return false;
					// reminder is not shown if hide post is shown!
					if (bubbleDefinitions['hide-post'].applicable()) return false;

					var confirmedForMoreThanAWeek = (((new Date()).getTime() - new Date($rootScope.loggedUser.confirmed_at).getTime()) > 604800000);
					return (
						($rootScope.loggedUser.reminders.indexOf('bookmark') > -1) && confirmedForMoreThanAWeek
					);
				},
				apply: function() {
					var template = 'templates/directives/bubble/bookmark-reminder.html';
					var placeholder = bubblePlaceholderSearch({
						identificator: 'bookmark-reminder'
					});
					if (placeholder) showBubble({
						placeholder: placeholder,
						templateUrl: template,
						type: 'bookmark'
					});
				}
			},
			'marketplace-item-mood': {
				applicable: function() {
					return ($rootScope.loggedUser._id && ($rootScope.loggedUser.reminders.indexOf('categories') > -1));
				},
				apply: function() {
					var template = 'templates/directives/bubble/marketplace-item-mood.html';
					// the target is in modal, so before attempting to search for it,
					// let's give it some time to render
					$timeout(function() {
						var placeholder = bubblePlaceholderSearch({
							identificator: 'marketplace-item-mood'
						});
						if (placeholder) showBubble({
							placeholder: placeholder,
							templateUrl: template,
							class: 'position-bottom-right',
							type: 'categories'
						});
					}, 500);
				}
			}
		};

		/**
		 *	the list of active bubble types
		 *	once a certain bubble type is active it can not be activated again
		 */
		var activeBubbles = [];
		/**
		 *	This function is called by bubble-placeholder directives to
		 *	try to activate the bubbles
		 */
		factory.try = function(definition) {
			if (bubbleDefinitions.hasOwnProperty(definition) && (activeBubbles.indexOf(definition) === -1) && bubbleDefinitions[definition].applicable()) {
				activeBubbles.push(definition);
				// if this is the first active bubble, bind event listener to document
				// to possibly remove the bubble
				if (activeBubbles.length === 1) $document.on('click', closeOnDocumentClick);
				bubbleDefinitions[definition].apply();
			}
		};

		/**
		 *	Only a helping function for searching for bubble placeholders
		 *	params = {
		 *			selector: String [optional, default = querySelector],
		 *			pre: String [optional], // css identificator to be applied before [bubble-placeholder]
		 *			identificator: String, // the type of the bubble
		 *			post: String [optional] // css identificator with additional attribute selectors
		 *	};
		 */
		function bubblePlaceholderSearch(params) {
			if (!params.identificator) throw new Error('Bubble identificator is required!');
			return document[(params.selector ? params.selector : 'querySelector')]((params.pre ? params.pre : '') + '[bubble-placeholder="' + params.identificator + '"]' + (params.post ? params.post : ''));
		}

		/**
		 *	paramObj = {
		 *			placeholder: DOM Node, // the node that we wish to insert our bubble into
		 *			templateUrl: String, // url of the html template
		 *			type: String // the type of the bubble
		 *			class: String [optional] // for positioning etc.
		 *	};
		 */
		function showBubble(paramObj) {
			if (!(paramObj.placeholder && paramObj.templateUrl && paramObj.type)) throw new Error('Insufficient parameters to show bubble');
			var scope = $rootScope.$new(true);
			scope.templateUrl = paramObj.templateUrl;
			scope.type = paramObj.type;
			scope.class = paramObj.class;
			var template = $compile('<bubble></bubble>')(scope);
			angular.element(paramObj.placeholder).append(template);
		}

		function closest(el, fn) {
			return el && (
				fn(el) ? el : closest(el.parentNode, fn)
			);
		}

		function closeOnDocumentClick(event) {
			var clickedOnBubble = closest(event.target, function(el) {
				return el.tagName && el.tagName.toLowerCase() === 'bubble';
			});
			var reason = (clickedOnBubble ? factory.CLOSE_REASONS.BUBBLE_CLICK : factory.CLOSE_REASONS.DOCUMENT_CLICK);
			$rootScope.$emit('closeBubble', {
				type: 'all',
				event: event,
				reason: reason
			});
		}

		/**
		 * Function will remove reminder from users reminders
		 */
		factory.removeReminder = function(paramObj) {
			if (!(paramObj.event && paramObj.type && paramObj.reason)) throw new Error('to succesfully remove a reminder, you need to supply an \'event\', a \'type\' and a \'reason\'');

			// special case scenario (should only exist when testing)
			if (!$rootScope.loggedUser.reminders || $rootScope.loggedUser.reminders.indexOf(paramObj.type) === -1) {
				$rootScope.$emit('closeBubble', {
					type: paramObj.type,
					event: paramObj.event,
					reason: paramObj.reason,
					justHide: true
				});
				return;
			} else if (paramObj.reason === 'dropdown-arrow-click') {
				$rootScope.$emit('closeBubble', {
					type: paramObj.type,
					justHide: true
				});
			}

			User.removeReminder({
				_id: $rootScope.loggedUser._id,
				type: paramObj.type
			}, function() {
				activeBubbles.splice(activeBubbles.indexOf(paramObj.type, 1));
				if (!activeBubbles.length) $document.off('click', closeOnDocumentClick);

				Auth.refreshUserInfo();

				$analytics.eventTrack('User closed reminder', {
					'context': $state.current.name,
					'Reason': paramObj.reason,
					'Bubble Type': paramObj.type
				});

				$rootScope.loggedUser.reminders.splice(paramObj.type, 1);
			});
		};

		return factory;

	}
]);
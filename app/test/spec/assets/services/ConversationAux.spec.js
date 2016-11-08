describe('ConversationAux factory', function() {
	var convFactory;

	beforeEach(angular.mock.module('hearth'));

	beforeEach(inject(function(_ConversationAux_) {
		convFactory = _ConversationAux_;
	}));

	// A simple test to verify the ConversationAux factory exists
	it('should exist', function() {
		expect(convFactory).toBeDefined();
	});

	describe('.getFirstConversationIdIfAny()', function() {

		it('should exist', function() {
			expect(convFactory.getFirstConversationIdIfAny).toBeDefined();
		});

		var empty = '';
		it('should return empty string', function() {
			expect(convFactory.getFirstConversationIdIfAny()).toEqual(empty);
		});
	});

//	describe('.addConversationToList(paramObject)', function() {
//
//		var paramObject = {
//			conversation : {
//				_id : 1,
//				participants : [ {
//					name : 'test'
//				} ]
//			}
//		};
//		it('should call method inside', function() {
//			spyOn(convFactory, 'deserializeConversation')
//			convFactory.addConversationToList(paramObject);
//
//			expect(convFactory.deserializeConversation).toHaveBeenCalled();
//		});
//	});
});

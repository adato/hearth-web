// Tests related to avatar directive
describe('avatar directive', function() {
  var $compile;
  var $rootScope;
  var $httpBackend;
  var template;

  beforeEach(module('hearth'));

  beforeEach(inject(function($injector,_$compile_ , _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(PATH.MESSAGES_JSON_EN_WHEN).respond(PATH.MESSAGES_JSON_EN_RESPONSE);
    $httpBackend.whenGET(/^https:\/\/api.dev.hearth.net\/session/).respond();
  }));

  it('directive html template is loaded', function() {
    // Compile a piece of HTML containing the directive
    var element = angular.element('<avatar></avatar>');
    element = $compile(element)($rootScope);

    // fire all the watches
    $rootScope.$digest();

    // result of the element shouldn't be empty string
    expect(element.html()).not.toEqual('');
  });
});

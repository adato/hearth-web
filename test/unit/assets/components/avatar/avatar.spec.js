// Tests related to avatar directive
describe('avatar directive', function() {
  var $compile,
    $rootScope,
    $httpBackend,
    template;

  beforeEach(() => {
    module('hearth.directives')
    module('hearth.templates')
  });

  // When templateUrl is used in directive, it is needed to load htmlTemplates module to preprocess html2js
  // beforeEach(module('htmlTemplates'));

  // Uncomment to check, that the template is loaded into the $templateCache
  // beforeEach(inject(function($templateCache) {
  //   template = $templateCache.get('assets/components/avatar/avatar.html');
  //   console.log('TEMPLATE ' + template);
  // }));


  beforeEach(inject(function($injector,_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $httpBackend = $injector.get('$httpBackend');

    // Mock request example
    // $httpBackend.whenGET('locales/en/messages.json').respond(readJSON('app/locales/en/messages.json'));

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

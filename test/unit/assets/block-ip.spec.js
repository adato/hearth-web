describe('Access to Hearth blocked by IP address', function () {
  var $window;
  var $httpBackend;
  var $http;

  beforeEach(module('hearth', function ($provide) {
    $provide.value('$window', {location: {href: ''}});
  }));

  // JSON returned from backend, when IP is blocked
  var blockResponseMock = {"ok": false, "error": "IP blocked", "message": "Exceptions::IPBlocked"};

  beforeEach(inject(function (_$window_, _$http_, _$httpBackend_) {
    $window = _$window_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET('some_request').respond(403, blockResponseMock);

    $httpBackend.whenGET(/^(http|https)/).respond();
    $httpBackend.whenGET(PATH.MESSAGES_JSON_EN_WHEN).respond(PATH.MESSAGES_JSON_EN_RESPONSE);
    $httpBackend.whenGET('assets/components/geo/markerTooltip.html').respond();
    $httpBackend.whenGET('assets/pages/static/error404.html').respond();
    $httpBackend.flush();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('User is redirect to the access denied page', function () {
    $http.get('some_request')
      .then(function (response) {
      });
    $httpBackend.flush();

    expect($window.location.href).toEqual('/app/access-denied.html');

  });
});

describe('Access to Hearth blocked by IP address', function () {
  var $httpBackend;
  var $http;
  var $location;

  // JSON returned from backend, when IP is blocked
  var blockResponseMock = {"ok": false, "error": "IP blocked", "message": "Exceptions::IPBlocked"};

  beforeEach(inject(function ($injector, _$http_, _$location_, _$httpBackend_) {
    $http = _$http_;
    $location = _$location_;

    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET(PATH.EXPECT_ACCESS_DENIED).respond(403, blockResponseMock);

    $httpBackend.whenGET(/^(http|https)/).respond();
    $httpBackend.whenGET(PATH.MESSAGES_JSON_EN_WHEN).respond(PATH.MESSAGES_JSON_EN_RESPONSE);
    $httpBackend.whenGET('assets/components/geo/markerTooltip.html').respond();
    $httpBackend.whenGET('assets/pages/static/error404.html').respond();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('User is redirect to the access denied page', function () {
    $http.get(PATH.EXPECT_ACCESS_DENIED)
      .then(() => {
        expect($location.path()).toEqual('/app/access-denied.html');
      });

    $httpBackend.flush();
  });
});

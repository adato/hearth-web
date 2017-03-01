describe('Register controller', function () {
  var $controller,
    $httpBackend,
    $http,
    $rootScope,
    $scope;


  beforeEach(module('hearth'));

  // JSON returned from backend, when email is blocked
  var blockEmailResponse = {"ok": false, "error": "email blocked", "message": "Exceptions::EmailBlocked"};

  beforeEach(inject(function ($injector, _$http_, _$controller_, _$rootScope_, _$httpBackend_) {
    $http = _$http_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    $httpBackend.whenPOST('https://api.dev.hearth.net/users?referrals[]=').respond(403, blockEmailResponse);

    $httpBackend.whenGET(/^https:\/\/api.dev.hearth.net\/session/).respond();

    $httpBackend.whenGET(PATH.MESSAGES_JSON_EN_WHEN).respond(PATH.MESSAGES_JSON_EN_RESPONSE);
    $httpBackend.flush();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var user;

  function mockBlockedEmailData() {
    user = {
      email: 'blocked-user@mailinator.com',
      first_name: 'Blocked',
      last_name: 'User',
      password: 'password'
    };

    $scope.registerForm = {
      email: {
        $error: {
          used: false
        }
      }
    };
    $scope.showError = {
      topError: false,
      first_name: false,
      email: false,
      password: false,
      blockedUserByEmail: false
    };
  }

  it('Cannot register, if blocked by email address', function () {
    $scope = $rootScope.$new();
    $controller('RegisterCtrl', {
      $scope: $scope
    });

    mockBlockedEmailData();

    $scope.sendRegistration(user);
    $httpBackend.flush();

    expect($scope.showError.blockedUserByEmail).toBeTruthy();
  });
});

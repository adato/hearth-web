describe('item directive - market place item', function () {
  var $compile;
  var $rootScope;
  var $httpBackend;

  beforeEach(module('hearth'));

  beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET(PATH.API_SESSION).respond(function () {
      return [200, ['success'], {}];
    });

    $httpBackend.whenGET(PATH.MESSAGES_JSON_EN_WHEN).respond(PATH.MESSAGES_JSON_EN_RESPONSE);
  }));


  it('2-way binding is set as expected', function () {
    prepareData();

    // Compile a piece of HTML containing the directive
    var element = angular.element('<item item="item"></item>');
    element = $compile(element)($rootScope);

    // fire all the watches
    $rootScope.$digest();

    // change the scope values
    $rootScope.item.title = 'Changed title of the post';
    $rootScope.item.author.name = 'Changed name';
    $rootScope.item.text = 'Changed item description';
    $rootScope.item.keywords = ['Changed'];

    $rootScope.$digest();

    var titleElement = element.querySelectorAll('[test-beacon="marketplace-item-post-title"]');
    var authorNameElement = element.querySelectorAll('[test-beacon="marketplace-item-author-name"]');
    var textElement = element.querySelectorAll('[test-beacon="marketplace-item-text"]');
    var replyElement = element.querySelectorAll('[test-beacon="marketplace-reply"]');
    var keywordsElement = element.querySelectorAll('[test-beacon="marketplace-keywords"]');

    // 2-way binding should be disabled
    expect(titleElement.html()).toEqual('Title of the post');
    expect(authorNameElement.html()).toEqual('David Hearth');
    expect(textElement.html()).toEqual('Item description parsed');
    expect(replyElement.html()).toEqual('NO_REPLY');
    expect(keywordsElement.html()).toEqual('gift');

    // 2-way binding should be enabled
    $rootScope.item.reply_count = 1;
    $rootScope.$digest();
    replyElement = element.querySelectorAll('[test-beacon="marketplace-reply"]');
    // another element is loaded due to change of reply_count
    expect(replyElement.html()).toBeUndefined();

  });

  function prepareData() {
    $rootScope.item = {
      _id: '123456789',
      title: 'Title of the post',
      text: 'Item description',
      text_parsed: 'Item description parsed', // return of nl2br and other filters
      text_short: 'Item description short',
      text_short_parsed: 'Item description parsed short',
      type: 'need', //need,offer
      reply_count: 0,
      author: {
        _id: '521f5d48b8f421d7200049d2',
        _type: 'User',
        name: 'David Hearth',
        updated_at: "2015-10-26T11:00:05.948+01:00",
        down_votes: 10,
        up_votes: 8,
        karma: "44%",
        avatar: {
          large: null,
          normal: null
        }
      },
      keywords: ['gift'],
      attachments_attributes: ''
    };

    $rootScope.isPostActive = function (item) {
      return true;
    };

  }

});

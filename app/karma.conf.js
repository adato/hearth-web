module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [

      // Load config stuff for the environment
      'test/unit/setup.js',
      'configuration/development.js',
      'app/assets/config-global.js',

      // vendors/libs
      'app/vendor/jquery/dist/jquery.js',
      'app/vendor/angular/angular.min.js',
      'app/vendor/angular-mobile-detect/dist/angular-mobile-detect.js',
      'app/vendor/angular-resource/angular-resource.min.js',
      'app/vendor/angular-sanitize/angular-sanitize.min.js',
      'app/vendor/angular-translate/angular-translate.min.js',
      'app/vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'app/vendor/angular-ui-router/release/angular-ui-router.min.js',
      'app/vendor/angular-loading-bar/build/loading-bar.js',
      'app/vendor/ngDialog/js/ngDialog.min.js',
      'app/libs/lemmon-slider.js',
      'app/libs/jquery.mailgun_validator.js',
      'app/vendor/angular-cookie/angular-cookie.min.js',
      'app/vendor/angular-dynamic-locale/src/tmhDynamicLocale.js',
      'app/vendor/angular-flexslider/angular-flexslider.js',
      'app/vendor/angularitics/dist/angulartics.min.js',
      'app/vendor/angularitics/dist/angulartics-ga.min.js',
      'app/vendor/angularitics/dist/angulartics-mixpanel.min.js',
      'app/vendor/async/lib/async.js',
      'app/libs/jquery.autosize.js',
      'app/vendor/fastclick/lib/fastclick.js',
      'app/vendor/foundation/js/foundation.min.js',
      'app/vendor/foundation-datepicker/js/foundation-datepicker.js',
      'app/vendor/jquery-color/jquery.color.js',
      'app/vendor/moment/min/moment.min.js',
      'app/vendor/nanoscroller/bin/javascripts/jquery.nanoscroller.min.js',
      'app/vendor/ng-slide-down/dist/ng-slide-down.min.js',
      'app/vendor/satellizer/satellizer.min.js',
      'app/vendor/SHA-1/sha1.js',
      'app/vendor/select2/select2.min.js',
      'app/vendor/ui-select/dist/select.min.js',
      'app/vendor/angular-select2/dist/angular-select2.min.js',
      'app/vendor/exif-js/exif.js',
      'app/vendor/fancybox/source/jquery.fancybox.js',
      'app/vendor/jquery.tipsy/js/jquery.tipsy.min.js',
      'app/vendor/jquery.cookie/jquery.cookie.js',
      'app/vendor/flexslider/jquery.flexslider-min.js',
      'app/vendor/smartcrop/smartcrop.js',
      'app/vendor/ng-tags-input/ng-tags-input.min.js',
      'app/vendor/markerclustererplus/dist/markerclusterer.min.js',
      'app/vendor/checklist-model/checklist-model.js',
      'app/vendor/overlapping-marker-spiderfier/oms.js',
      'app/vendor/angular-websocket/dist/angular-websocket.js',
      'app/vendor/angular-actioncable/dist/angular-actioncable.js',
      'app/vendor/international-phone-number/releases/international-phone-number.js',
      'app/vendor/angular-mobile-detect/dist/angular-mobile-detect.js',
      'app/vendor/intl-tel-input/build/js/intlTelInput.js',
      'app/vendor/intl-tel-input/lib/libphonenumber/build/utils.js',
      'app/vendor/angular-mocks/angular-mocks.js',

      // application js
      'app/assets/bootstrap.js',
      'app/assets/utils/jqueryQueryParams.js',
      'app/assets/utils/device.js',
      'app/assets/app.js',
      'app/assets/routes.js',
      'app/assets/services/resources/Ratings.js',
      'app/assets/services/resources/ChangePassword.js',
      'app/assets/services/resources/Community.js',
      'app/assets/services/resources/CommunityActivityLog.js',
      'app/assets/services/resources/CommunityApplicants.js',
      'app/assets/services/resources/CommunityDelegateAdmin.js',
      'app/assets/services/resources/CommunityLeave.js',
      'app/assets/services/resources/CommunityMembers.js',
      'app/assets/services/resources/CommunityMemberships.js',
      'app/assets/services/resources/CommunityRatings.js',
      'app/assets/services/resources/Email.js',
      'app/assets/services/resources/Feedback.js',
      'app/assets/services/resources/Filter.js',
      'app/assets/services/resources/FolloweePosts.js',
      'app/assets/services/resources/Followees.js',
      'app/assets/services/resources/FolloweeSearch.js',
      'app/assets/services/resources/Followers.js',
      'app/assets/services/resources/Friends.js',
      'app/assets/services/resources/Fulltext.js',
      'app/assets/services/resources/Info.js',
      'app/assets/services/resources/Interest.js',
      'app/assets/services/resources/Invitation.js',
      'app/assets/services/resources/ItemDetailResource.js',
      'app/assets/services/resources/Keywords.js',
      'app/assets/services/resources/Password.js',
      'app/assets/services/resources/Post.js',
      'app/assets/services/resources/PostReplies.js',
      'app/assets/services/resources/Session.js',
      'app/assets/services/resources/Tutorial.js',
      'app/assets/services/resources/User.js',
      'app/assets/services/resources/UserLocation.js',
      'app/assets/services/resources/UserRatings.js',
      'app/assets/services/resources/UserBookmarks.js',
      'app/assets/services/resources/UsersActivityLog.js',
      'app/assets/services/resources/Conversations.js',
      'app/assets/services/transforms/ConversationDataTransform.js',
      'app/assets/services/transforms/LocationJsonDataTransform.js',
      'app/assets/services/$feature.js',
      'app/assets/services/$session.js',
      'app/assets/services/Ab.js',
      'app/assets/services/Activities.js',
      'app/assets/services/ApiHealthChecker.js',
      'app/assets/services/ApiErrorInterceptor.js',
      'app/assets/services/ApiMaintenanceInterceptor.js',
      'app/assets/services/Auth.js',
      'app/assets/services/Bubble.js',
      'app/assets/services/Communities.js',
      'app/assets/services/ConversationAux.js',
      'app/assets/services/CountryList.js',
      'app/assets/services/DOMTraversalService.js',
      'app/assets/services/Errors.js',
      'app/assets/services/Facebook.js',
      'app/assets/services/FileService.js',
      'app/assets/services/Filter.js',
      'app/assets/services/FolloweesPostsService.js',
      'app/assets/services/FolloweesSearchService.js',
      'app/assets/services/FulltextService.js',
      'app/assets/services/HearthCrowdfunding.js',
      'app/assets/services/HearthLoginInterceptor.js',
      'app/assets/services/InfiniteScrollPagination.js',
      'app/assets/services/IsEmpty.js',
      'app/assets/services/ItemAux.js',
      'app/assets/services/ItemServices.js',
      'app/assets/services/Karma.js',
      'app/assets/services/KeywordsService.js',
      'app/assets/services/LanguageList.js',
      'app/assets/services/LanguageSwitch.js',
      'app/assets/services/LocalStorage.js',
      'app/assets/services/Messenger.js',
      'app/assets/services/MultipartForm.js',
      'app/assets/services/Notify.js',
      'app/assets/services/OpenGraph.js',
      'app/assets/services/PageTitle.js',
      'app/assets/services/PostsService.js',
      'app/assets/services/ProfileProgress.js',
      'app/assets/services/ProfileUtils.js',
      'app/assets/services/ResponseErrors.js',
      'app/assets/services/ResponsiveViewport.js',
      'app/assets/services/Rights.js',
      'app/assets/services/RubySerializer.js',
      'app/assets/services/ScrollService.js',
      'app/assets/services/SessionLanguageStorage.js',
      'app/assets/services/Time.js',
      'app/assets/services/timeAgoService.js',
      'app/assets/services/Throttle.js',
      'app/assets/services/UnauthReload.js',
      'app/assets/services/UniqueFilter.js',
      'app/assets/services/UsersCommunitiesService.js',
      'app/assets/services/UsersService.js',
      'app/assets/services/Validators.js',
      'app/assets/services/ViewPort.js',
      'app/assets/services/ViewportUtils.js',
      'app/assets/filters/filters.js',
      'app/assets/services/PostScope.js',
      'app/assets/components/navigation/navigation.js',
      'app/assets/components/ratingReply/ratingReply.js',
      'app/assets/components/analyticsCustom/analyticsCustom.js',
      'app/assets/components/communitySelector/communitySelector.js',
      'app/assets/components/slideTrigger/slideTrigger.js',
      'app/assets/components/ago/ago.js',
      'app/assets/components/classIfOverflow/classIfOverflow.js',
      'app/assets/components/dynamicHeight/dynamicHeight.js',
      'app/assets/components/conversationReply/conversationReply.js',
      'app/assets/components/tipsy/tipsy.js',
      'app/assets/components/lemmonSlider/lemmonSlider.js',
      'app/assets/components/sharingWindow/sharingWindow.js',
      'app/assets/components/invitationForm/invitationForm.js',
      'app/assets/components/activityAvatar/activityAvatar.js',
      'app/assets/components/avatar/avatar.js',
      'app/assets/components/addressAutocomplete/addressAutocomplete.js',
      'app/assets/components/paginationMarker/paginationMarker.js',
      'app/assets/components/scrollTo/scrollTo.js',
      'app/assets/components/htmlLabel/htmlLabel.js',
      'app/assets/components/signedOut/signedOut.js',
      'app/assets/components/signedIn/signedIn.js',
      'app/assets/components/social/social.js',
      'app/assets/components/datepicker/datepicker.js',
      'app/assets/components/needOfferSelector/needOfferSelector.js',
      'app/assets/components/filesPicker/filesPicker.js',
      'app/assets/components/filter/filter.js',
      'app/assets/components/filterbar/filterbar.js',
      'app/assets/components/filterbarFulltext/filterbarFulltext.js',
      'app/assets/components/filterStatus/filterStatus.js',
      'app/assets/components/item/item.js',
      'app/assets/components/communityItem/communityItem.js',
      'app/assets/components/radio/radio.js',
      'app/assets/components/checkbox/checkbox.js',
      'app/assets/components/ngEnter/ngEnter.js',
      'app/assets/components/imagePreview/imagePreview.js',
      'app/assets/components/resizedThumbnailImage/resizedThumbnailImage.js',
      'app/assets/components/exifRotated/exifRotated.js',
      'app/assets/components/fancybox/fancybox.js',
      'app/assets/components/refocusInputOnTab/refocusInputOnTab.js',
      'app/assets/components/autosizeTextarea/autosizeTextarea.js',
      'app/assets/components/maxLenCounter/maxLenCounter.js',
      'app/assets/components/showTextInPassword/showTextInPassword.js',
      'app/assets/components/dynamicText/dynamicText.js',
      'app/assets/components/showIfDifferentDates/showIfDifferentDates.js',
      'app/assets/components/ngPluralize/ngPluralize.js',
      'app/assets/components/communityCreateEdit/communityCreateEdit.js',
      'app/assets/components/flexslider/flexslider.js',
      'app/assets/components/historyParamPusher/historyParamPusher.js',
      'app/assets/components/loading/loading.js',
      'app/assets/components/mapItems/mapItems.js',
      'app/assets/components/dontJumpTop/dontJumpTop.js',
      'app/assets/components/dropdown/dropdown.js',
      'app/assets/components/emailValidator/emailValidator.js',
      'app/assets/components/marketplaceBanner/marketplaceBanner.js',
      'app/assets/components/userSelector/userSelector.js',
      'app/assets/components/authorSelector/authorSelector.js',
      'app/assets/components/conversationDetail/conversationDetail.js',
      'app/assets/components/conversationAdd/conversationAdd.js',
      'app/assets/components/infoBox/infoBox.js',
      'app/assets/components/customScrollbar/customScrollbar.js',
      'app/assets/components/scrollToViewOnHash/scrollToViewOnHash.js',
      'app/assets/components/validateEmail/validateEmail.js',
      'app/assets/components/karmaBar/karmaBar.js',
      'app/assets/components/selectOnFocus/selectOnFocus.js',
      'app/assets/components/inputMaxLength/inputMaxLength.js',
      'app/assets/components/privacySelector/privacySelector.js',
      'app/assets/components/userIntelReadout/userIntelReadout.js',
      'app/assets/components/fileViewer/fileViewer.js',
      'app/assets/components/bubble/bubble.js',
      'app/assets/components/bubblePlaceholder/bubblePlaceholder.js',
      'app/assets/components/whenScrolled/whenScrolled.js',
      'app/assets/components/checkCapitals/checkCapitals.js',
      'app/assets/components/timeAgo/timeAgo.js',
      'app/assets/components/apiPrefix/apiPrefix.js',
      'app/assets/components/validatedCheckbox/validatedCheckbox.js',
      'app/assets/components/withErrors/withErrors.js',
      'app/assets/components/ctrlEnterSubmit/ctrlEnterSubmit.js',
      'app/assets/components/mailgunValidator/mailgunValidator.js',
      'app/assets/utils/ExifRestorer.js',
      'app/assets/utils/eventPause.js',
      'app/assets/components/abTest/abTest.js',
      'app/assets/components/geo/geo.js',
      'app/assets/components/geo/locations.js',
      'app/assets/components/searchMap/searchMap.js',
      'app/assets/components/geo/map.js',
      'app/assets/components/suspendable/suspendable.js',
      'app/assets/pages/static/ComponentsCtrl.js',
      'app/assets/pages/BaseCtrl.js',
      'app/assets/pages/map/MapCtrl.js',
      'app/assets/pages/market/_MarketCtrl.js',
      'app/assets/pages/market/MarketCtrl.js',
      'app/assets/pages/profile/ProfileCtrl.js',
      'app/assets/pages/profile/ProfileSettingsCtrl.js',
      'app/assets/pages/profile/ProfileEditCtrl.js',
      'app/assets/pages/profile/ProfileInviteCtrl.js',
      'app/assets/pages/profile/ProfileDataFeedCtrl.js',
      'app/assets/pages/userForms/RegisterCtrl.js',
      'app/assets/pages/userForms/ConfirmEmailCtrl.js',
      'app/assets/pages/userForms/ForgottenPasswordCtrl.js',
      'app/assets/pages/userForms/ResetPwdCtrl.js',
      'app/assets/pages/static/FeedbackCtrl.js',
      'app/assets/pages/static/TermsCtrl.js',
      'app/assets/pages/community/CommunityProfileCtrl.js',
      'app/assets/pages/community/CommunityCreateCtrl.js',
      'app/assets/pages/community/CommunitiesCtrl.js',
      'app/assets/pages/community/CommunityListCtrl.js',
      'app/assets/pages/community/CommunityDataFeedCtrl.js',
      'app/assets/pages/userForms/LoginCtrl.js',
      'app/assets/pages/fulltext/FulltextCtrl.js',
      'app/assets/pages/static/Error404Ctrl.js',
      'app/assets/pages/userForms/FillEmailCtrl.js',
      'app/assets/pages/item/ItemDetail.js',
      'app/assets/pages/item/ItemDetailOld.js',
      'app/assets/pages/userForms/TokenLoginCtrl.js',
      'app/assets/pages/messages/MessagesCtrl.js',
      'app/assets/pages/static/LocalizationPage.js',
      'app/assets/pages/static/LanguageChangeCtrl.js',
      'app/assets/pages/static/StaticPageCtrl.js',
      'app/assets/modals/RemoveItemFromCommunity.js',
      'app/assets/modals/ModalContainer.js',
      'app/assets/modals/NewMessage.js',
      'app/assets/modals/ItemReport.js',
      'app/assets/modals/LinkSharing.js',
      'app/assets/modals/EmailSharing.js',
      'app/assets/modals/ItemEdit.js',
      'app/assets/modals/ItemReply.js',
      'app/assets/modals/Tutorial.js',
      'app/assets/modals/InviteBox.js',
      'app/assets/modals/ConfirmBox.js',
      'app/assets/modals/ItemSuspend.js',
      'app/assets/constants/MottoLength.js',
      'app/assets/constants/MarketPostCount.js',
      'node_modules/karma-read-json/karma-read-json.js',

      // load JSONs
      {pattern: 'app/locales/**/*.json', included: false},

      // application tests
      'test/unit/**/**/*.spec.js',

      // application HTML
      'app/assets/components/**/*.html'
    ],

    ngHtml2JsPreprocessor: {
      //
      stripPrefix: 'app/',
      moduleName: 'htmlTemplates'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/assets/components/**/*.html': ['ng-html2js']
    },

    proxies: {
      // return fake file from the running container, version.txt is not available
      '/version.txt': 'http://localhost:9876'
    },

    // list of files to exclude
    exclude: [],

    // possible values: 'spec', 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'junit'],

    junitReporter: {
      outputDir: 'test', // results will be saved as $outputDir/$browserName.xml
      outputFile: 'unit-tests-result.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
      useBrowserName: false // add browser name to report and classes names
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],

    browserNoActivityTimeout: 100000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};

// Karma configuration

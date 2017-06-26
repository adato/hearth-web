'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.UiKitCtrl
 * @description
 */

angular.module('hearth.controllers').controller('UiKitCtrl', [
  '$scope', '$sce', '$compile', '$timeout',
  function ($scope, $sce, $compile, $timeout) {

    // @kamil Can't use controllerAs here because I don't know how to bind to ctrl with $compile
    // const ctrl = this;

    // inited in markup
    $scope.activeTab

    $scope.buttons = [];
    $scope.typographies = [];
    $scope.inputs = [];

    /*
     Data section
     attributes:
     name - element name
     code - element html code
     desc - description/comment
     */

    const getTypographiesData = () => {
      return [
        {name: 'Header 1', code: '<div class="primary-header">Pro lidi s otevřeným srdcem</div>'},
        {name: 'Header 2', code: '<h2 class="secondary-header">Sdílejte dary a přání</h2>'},
        {name: 'Header 3', code: '<h3 class="tertiary-header">Prostor pro lidi s otevřeným srdcem</h3>'},
        {name: 'Header 4', code: '<h4 class="quaternary-header">Prostor pro lidi s otevřeným srdcem</h4>'},
        {name: 'Header 5', code: '<h5 class="quinary-header">Prostor pro lidi s otevřeným srdcem</h5>'},
        {name: 'Header 6', code: '<h6 class="senary-header">Prostor pro lidi s otevřeným srdcem</h6>'},
        {
          name: 'Paragraph',
          code: '<p>Co nás baví a naplňuje, posíláme dál. Co sami potřebujeme, dostáváme od druhých. Bez peněz. Bez principu „co za to”. Jen tak, pro radost :-)</p>'
        },
        {
          name: 'Label',
          code: '<div class="label">R2D2</div><div class="label warning hollow">C3PO</div><div class="label alert">These aren\'t the labels you\'re looking for</div>'
        }

      ];
    };

    const getButtonsData = () => {
      return [
        {code: '<button class="button">primary</button>'},
        {code: '<button class="button secondary">secondary</button>'},
        {code: '<button class="button offer">need</button>', desc: 'The style is set according to post character.'},
        {code: '<button class="button need">offer</button>', desc: 'The style is set according to post character.'},
        {code: '<button class="button dark-gray">dark-gray</button>'},
        {code: '<button class="button"><i class="fa fa-globe"></i><span>text</span></button>'},
        {code: '<button class="button"><i class=\"fa fa-globe\"></i></button>'},
        {code: '<button class="hollow button">primary inv</button>'},
        {code: '<button class="hollow button secondary">secondary inv</button>'},
        {code: '<button class="button disabled">disabled</button>'}
      ];
    };

    const getInputsData = () => {
      return [
        {code: '<input type="text" placeholder="placeholder">'},
        {code: '<input type="number" value="10">'},
        {code: '<textarea placeholder="Text area ..."></textarea>'},
      ];
    };

    function getAvatarData() {
      return {
        code: `<avatar class="block" size="normal" src="loggedUser.avatar.normal" type="\'User\'"></avatar>

<div class="avatar-stack">
  <avatar size="small" src="loggedUser.avatar.normal" type="\'User\'"></avatar>
  <avatar size="small"></avatar>
</div>`,
        selector: '[avatars]',
        scopeId: 'avatars'
      }
    }

    init()

    ///////////////////////////////////////////////////////////////////////

    function init() {
      prepareElementData($scope.buttons, getButtonsData())
      prepareElementData($scope.typographies, getTypographiesData())
      prepareElementData($scope.inputs, getInputsData())
      compileData(getAvatarData())
      compileData(getFormData())
    }

    function getFormData() {

      // every first attempt to submit will end success, every other will simulate an error
      var submitWillBeSuccess = true;

      // prepare models
      $scope.formLoading;
      $scope.savingFormError;
      $scope.savingFormSuccess;
      $scope.validationError;
      $scope.testFormData = {
        name: '',
        surname: ''
      }
      $scope.genderList = [
        {title: 'GENDER.AGENDER', value: 'agender'},
        {title: 'GENDER.ANDROGYNE', value: 'androgyne'},
        {title: 'GENDER.ANDROGYNOUS', value: 'androgynous'},
        {title: 'GENDER.BIGENDER', value: 'bigender'},
        {title: 'GENDER.CIS', value: 'cis'}
      ]
      // bind submit function to controller
      // ctrl.testFormSubmit = (data, form) => {
      $scope.testFormSubmit = (data, form) => {
        form.$setDirty()

        $scope.savingFormSuccess = false
        $scope.savingFormError = false

        // validation
        $scope.validationError = false
        if (!form.$valid) return $scope.validationError = true

        // simulate API call
        $scope.formLoading = true
        $timeout(() => {
          if (submitWillBeSuccess) {
            $scope.formLoading = false
            $scope.savingFormSuccess = true
            form.$setPristine()
            form.$setUntouched()

          } else {
            $scope.formLoading = false
            $scope.savingFormError = true
          }
          submitWillBeSuccess = !submitWillBeSuccess
        }, 1000)

      }

      // and return template
      return {
        code:
`<form name="testForm" id="testForm" ng-submit="testFormSubmit(testFormData, testForm, uiKit)" novalidate>
  <div ng-show="savingFormSuccess" class="callout cursor-pointer success" ng-click="savingFormSuccess = false" translate="FORM.SAVING_SUCCESS"></div>
  <div ng-show="savingFormError" class="callout cursor-pointer error" ng-click="savingFormError = false">
    <div translate="FORM.SAVING_FAILED"></div>
    <span>reason, if any</span>
  </div>

  <label class="block">
    <span translate="PERSON.NAME"></span>
    <input type="text" name="name" ng-model="testFormData.name" translate-attr="{placeholder: 'PERSON.NAME'}" required minlength="2" />
    <div class="help-text" translate="PERSON.NAME.HELPTEXT"></div>
    <div ng-messages="testForm.name.$error" ng-show="testForm.$submitted || testForm.name.$dirty">
      <div ng-messages-include="assets/components/form/ngMessages/required.html"></div>
      <div ng-messages-include="assets/components/form/ngMessages/minlength.html"></div>
    </div>
  </label>

  <label class="block">
    <span translate="PERSON.SURNAME"></span>
    <input type="text" name="surname" ng-model="testFormData.surname" translate-attr="{placeholder: 'PERSON.SURNAME'}" required />
    <div ng-messages="testForm.surname.$error" ng-show="testForm.$submitted || testForm.surname.$dirty">
      <div ng-message="required" translate="PERSON.SURNAME.ERROR_REQUIRED"></div>
    </div>
  </label>

  <label class="block">
    <span translate="PERSON.SURNAME"></span>
    <select name="gender" ng-model="testFormData.gender" required translate-attr="{placeholder: 'PERSON.GENDER'}" required ng-options="gender.value as (gender.title | translate) for gender in genderList">
      <option value="" translate="GENDER.SELECT"></option>
    </select>
    <div class="help-text">Notice how the placeholder option (with empty value) is entered directly, while all the other options are generated from a controller list</div>
    <div ng-messages="testForm.surname.$error" ng-show="testForm.$submitted || testForm.surname.$dirty">
      <div ng-messages-include="assets/components/form/ngMessages/required.html"></div>
    </div>
  </label>

  <div class="block">
    <div class="box box--checkbox-list">
      <label>
        <checkbox model="testFormData.sth1" name="sth1" class="box box--checkbox">
          <span translate="SOMETHING.ONE"></span>
        </checkbox>
      </label>
      <label>
        <checkbox model="testFormData.sth2" name="sth2" class="box box--checkbox" disabled="testFormData.sth1">
          <span translate="SOMETHING.TWO"></span>
        </checkbox>
      </label>
    </div>
    <div class="help-text">This checkbox list logic doesn't make sense but showcases how to style such lists and how to apply the disabled attribute</div>
  </div>

  <div class="block flex-grid">
    <label>
      <checkbox model="testFormData.sth3" name="sth3">
        <span translate="SOMETHING.THREE"></span>
      </checkbox>
    </label>
    <label>
      <checkbox model="testFormData.sth4" name="sth4">
        <span translate="SOMETHING.FOUR"></span>
      </checkbox>
    </label>
  </div>

  <label class="block">
    <checkbox model="testFormData.eula" required name="eula" class="box box--checkbox" ng-class="{'invalid': testForm.eula.$invalid && (testForm.$submitted || testForm.eula.$dirty)}">
      <span translate="EULA.ACCEPT"></span>
    </checkbox>
    <div class="help-text">Invalid border is set manually</div>
    <div ng-messages="testForm.eula.$error" ng-show="testForm.$submitted || testForm.eula.$dirty">
      <div ng-messages-include="assets/components/form/ngMessages/required.html"></div>
    </div>
  </label>

  <div class="flex flex-divided-medium">
    <button class="button" type="submit" translate="FORM.SUBMIT"></button>
    <i class="fa fa-spinner fa-spin" ng-if="formLoading"></i>
  </div>
</form>`,
        selector: '[form-data]',
        scopeId: 'formData',
      }
    }

    ///////////////////////////////////////////////////////////////////////

    /**
     * HELPER FUNCTIONS
     */

    // Bind data directly to template
    function compileData(data) {
      angular.element(data.selector).append($compile(data.code)($scope))
      $scope[data.scopeId] = data.code
    }

    // Prepare data for binding to html
    function prepareElementData(scopeElementList, inputDataList) {
      inputDataList.forEach(element => {
        scopeElementList.push({
          name: element.name || "",
          code: $sce.trustAsHtml(element.code),
          description: (element.desc || "") + " " + element.code
        })
      })
    }

  }
])
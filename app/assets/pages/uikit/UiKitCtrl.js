'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.UiKitCtrl
 * @description
 */

angular.module('hearth.controllers').controller('UiKitCtrl', [
  '$scope', '$sce',
  function ($scope, $sce) {
    $scope.buttons = [];
    $scope.typographies = [];
    $scope.inputs = [];


    /*
     Prepare data for binding to html
     */
    const prepareElementData = (scopeElementList, inputDataList) => {
      inputDataList.forEach((element) => {
        scopeElementList.push({
          name: element.name || "",
          code: $sce.trustAsHtml(element.code),
          description: (element.desc || "") + " " + element.code
        });
      });

    };

    /*
     Data section
     attributes:
     name - element name
     code - element html code
     desc - description/comment
     */

    const getTypographiesData = () => {
      return [
        {code: '<h1>Pro lidi s otevřeným srdcem</h1>', name: 'Header 1'},
        {code: '<h2>Sdílejte dary a přání</h2>', name: 'Header 2'},
        {code: '<h3>Prostor pro lidi s otevřeným srdcem</h3>', name: 'Header 3'},
        {
          code: '<p>Co nás baví a naplňuje, posíláme dál. Co sami potřebujeme, dostáváme od druhých. Bez peněz. Bez principu „co za to”. Jen tak, pro radost :-)</p>',
          name: 'Paragraph'
        },

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
    const init = () => {
      prepareElementData($scope.buttons, getButtonsData());
      prepareElementData($scope.typographies, getTypographiesData());
      prepareElementData($scope.inputs, getInputsData());
    };

    init();
  }
]);

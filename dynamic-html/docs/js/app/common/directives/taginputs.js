define([
  'appModule',
  'underscore'
], function (app, _) {
  app.directive('tagInputs', function ($timeout, $i18n, $document, $utilities) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        tagsdata: '=tagsdata',
        tags: '=',
        setFn: '&',
        tagsKey: '=tagsKey'
      },
      template: '<div class="tags">' + '<ng-form name="tagsForm">' + '<div class="form-group--typeahead" ng-show="tagsKey == 0">' + '<input ng-pattern="tagRegex" type="text" id="inputTag" name="inputTag" maxlength="50" placeholder="Add a tag..." ng-model="tagText" typeahead="ss for ss in tagsdata | filter:$viewValue | limitTo:5" typeahead-on-select="addTag($item)" autofocus/>' + '<button class="button button--icon" ng-disabled="!canAddTag(tagText)" ng-click="addTag(tagText);" apollo-collect="HU-AddTag" type="button">' + '<span class="icon-plus"></span>' + '</button>' + '<span ng-repeat="(idx, tag) in tags" class="label label-info">' + '<span title="{{ tag }}" ng-bind="tag"></span>' + '<a class="icon-close" ng-click="deleteTag(idx)" apollo-collect="HU-DeleteTag"></a>' + '</span>' + '</div>' + '<div ng-show="tagsKey == 1">' + '<span ng-class="{\'ng-hide\': tags.length}" ng-bind=" \'_NoTagsAvailable_\' | i18n "></span>' + '<span ng-repeat="(idx, tag) in tags" class="label label-info">' + '<span title="{{ tag }}" ng-bind="tag"></span>' + '<a class="icon-close" ng-click="deleteTag(idx)" apollo-collect="HU-DeleteTag"></a>' + '</span>' + '</div>' + '<span class="help-block text-warning" ng-show="tagsForm.inputTag.$error.pattern">' + '<span class="icon-exclamation-circle"></span> ' + '<span ng-bind=" \'_IBDSTagsErrorMsg_\' | i18n "></span>' + '</span>' + '</ng-form>' + '</div>',
      link: function ($scope, $element) {
        var $input = $element.find('#inputTag');
        $scope.tagRegex = $utilities.REGEX_TAG;
        $scope.tagText = '';
        // This adds the new tag to the tags array
        $scope.addTag = function (tag) {
          if ($scope.canAddTag(tag)) {
            $scope.tags.push(tag.toLowerCase());
            $scope.tagText = '';
          }
          $input.focus();
        };
        $scope.canAddTag = function (tag) {
          var formattedTag = tag && tag.toLowerCase() || '';
          return formattedTag.length && !$scope.tagsForm.inputTag.$error.pattern && !_.includes($scope.tags, formattedTag);
        };
        $scope.setFn({ theTagFn: $scope.addTag });
        //This delete the tag for the tag array
        $scope.deleteTag = function (idx) {
          if (_.isNumber(idx)) {
            $scope.tags.splice(idx, 1);
          } else if ($scope.tags.length && !$scope.tagText) {
            $scope.tags.pop();
          }
        };
        $element.on('click', function () {
          $input.focus();
        });
        $input.on('keydown', function (e) {
          var key = e.which || e.keyCode;
          $scope.$emit('tagError', $scope.tagsForm.inputTag.$error.pattern);
          // 8 = Delete
          // 9 = Tab
          // 13 = Enter
          // 44 = Print Screen?
          // 188 = comma
          // Delete the last tag
          if (key === 8) {
            $utilities.safeApply($scope.deleteTag);
          }
          // Add current text
          if (e.target.value && (key === 9 || key === 13 || key === 44 || key === 188)) {
            e.preventDefault();
            e.stopPropagation();
            $utilities.safeApply(function () {
              $scope.addTag($scope.tagText);
            });
            // When using the keys to add something from the input
            // field instead of the dropdown, we have to trigger a
            // click to close the dropdown
            $document.trigger('click');
          }
        });
      }
    };
  });
});
'use strict';

describe('Controller: CardTypeCtrl', function () {

  // load the controller's module
  beforeEach(module('lowlaApp'));

  var CardTypeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CardTypeCtrl = $controller('CardTypeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

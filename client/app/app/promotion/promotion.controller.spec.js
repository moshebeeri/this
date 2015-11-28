'use strict';

describe('Controller: PromotionCtrl', function () {

  // load the controller's module
  beforeEach(module('lowlaApp'));

  var PromotionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionCtrl = $controller('PromotionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

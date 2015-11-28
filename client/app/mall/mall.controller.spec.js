'use strict';

describe('Controller: MallCtrl', function () {

  // load the controller's module
  beforeEach(module('lowlaApp'));

  var MallCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MallCtrl = $controller('MallCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

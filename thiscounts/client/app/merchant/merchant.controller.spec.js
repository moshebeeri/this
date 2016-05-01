'use strict';

describe('Controller: MerchantCtrl', function () {

  // load the controller's module
  beforeEach(module('lowlaApp'));

  var MerchantCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MerchantCtrl = $controller('MerchantCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

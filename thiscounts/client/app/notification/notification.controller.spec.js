'use strict';

describe('Controller: NotificationCtrl', function () {

  // load the controller's module
  beforeEach(module('lowlaApp'));

  var NotificationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NotificationCtrl = $controller('NotificationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

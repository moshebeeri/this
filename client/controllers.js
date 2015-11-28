function HelloController($scope) {
  $scope.greeting = { text: 'Hello' };
}


function DiscountsController($scope) {
  $scope.discounts = [
    { name:"Prada spring collection", type:"1+1", id:"id1", image:"http://www.vogue-elements.com/media/catalog/product/cache/1/small_image/500x500/9df78eab33525d08d6e5fb8d27136e95/w/r/wrx20130820128.jpg"},
    { name:"Adidas tenis gear", type:"10^20", id:"id2", image:"http://i1.wp.com/cornedbeefhash.files.wordpress.com/2009/12/picture-21.png?resize=368%2C251"}
  ];
  $scope.show = true;
}

function Cart2Controller($scope) {
  $scope.bill = {};
  $scope.items = [
    {title: 'Paint pots', quantity: 8, price: 3.95},
    {title: 'Polka dots', quantity: 17, price: 12.95},
    {title: 'Pebbles', quantity: 5, price: 6.95}
  ];

  // var calculateTotals = function() {
  //   var total = 0;
  //   for (var i = 0, len = $scope.items.length; i < len; i++) {
  //     total = total + $scope.items[i].price * $scope.items[i].quantity;
  //   }
  //   $scope.bill.totalCart = total;
  //   $scope.bill.discount = total > 100 ? 10 : 0;
  //   $scope.bill.subtotal = total - $scope.bill.discount;
  // };
  // $scope.$watch('items', calculateTotals, true);
  $scope.$watch(function() {
    var total = 0;
    $scope.items.forEach(function(item){
      total = total + item.price * item.quantity;
    });
    $scope.bill.total = total;
    $scope.bill.discount = total > 100 ? 10 : 0;
    $scope.bill.subtotal = total - $scope.bill.discount;
  });
  // $scope.totalCart = function() {
  //   var total = 0;
  //   $scope.items.forEach(function(item) {
  //       total += item.quantity * item.price;
  //   })
  //   return total;
  // }
  // $scope.subtotal = function() {
  //   return $scope.totalCart() - $scope.bill.discount;
  // };
  //
  // function calculateDiscount(newValue, oldValue, scope) {
  //   discountPercentage = newValue > 100 ? 10 : 0;
  //   $scope.bill.discount = (discountPercentage/100.0)*newValue
  // }
  // $scope.$watch($scope.totalCart, calculateDiscount);
}

const gaussian = require('gaussian');
const ss = require('simple-statistics');

'use strict';

function Distributor() {
}


Distributor.distributePromotions =
  Distributor.prototype.distributePromotions = function (min, max, delta, quantity) {
    let values = [min, max];
    let mean = ss.mean(values);
    let variance = ss.variance(values);
    const distribution = gaussian(mean, variance);

    let spreads = [];
    let some_area = 0;
    for (let value = min; value <= max; value += delta) {
      let spread = {};
      let from = value - delta / 2;
      let to = value + delta / 2;
      spread.area = distribution.cdf(to) - distribution.cdf(from);
      spread.value = value;
      some_area += spread.area;
      spreads.push(spread)
    }
    let sumq = 0;

    //http://stackoverflow.com/questions/792460/how-to-round-floats-to-integers-while-preserving-their-sum
    //https://jsfiddle.net/cd8xqy6e/
    let fpTotal = 0;
    let intTotal = 0;
    spreads.forEach((spread) => {
      let float = (spread.area / some_area) * quantity;
      spread.quantity = Math.round(float + fpTotal) - intTotal;
      fpTotal += float;
      intTotal += spread.quantity;
      delete spread.area;
      sumq += spread.quantity;
    });
    console.log(sumq);
    return spreads;
  };

module.exports = Distributor;


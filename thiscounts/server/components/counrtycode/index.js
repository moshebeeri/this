'use strict';

//TODO: use this package - npm i google-libphonenumber

const codesData = require('./data/codes');

let countryCodes = [];
countryCodes.push('1');
codesData.forEach(countryData => countryCodes.push(countryData.code.toString()));

function CountryCode() {
}

CountryCode.send =
  CountryCode.prototype.send = function() {
};

CountryCode.print = function() {
  console.log(JSON.stringify(countryCodes));
};

function startsWithCountryCode(number) {
  for(let i=0; i< countryCodes.length; i++){
    if(number.startsWith(countryCodes[i]))
      return true;
  }
  return false;
}

CountryCode.validateNormalize = function(number, defaultCode) {
  let normalized = this.normalize(number, defaultCode);
  if(normalized.length<11)
    return null;
  return normalized;
};

CountryCode.normalize =
  CountryCode.prototype.normalize = function(number, defaultCode) {

  if(number.startsWith('+')){
    return number.replace(/\D/g, '');
  }

  number = number.replace(/\D/g, '').replace(/^[0]+/g,'');
  if(number.startsWith('1800') ||
      number.startsWith('0800')  ||
      number.startsWith('0808')    ){
      return '';
  }

  if(number.length > 9 && startsWithCountryCode(number)) {
    return number;
  }
  return defaultCode + number
};


module.exports = CountryCode;



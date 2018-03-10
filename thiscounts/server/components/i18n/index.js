'use strict';

const I18n = require('../../api/i18n/i18n.model.js');

let i18ns = null;

function load(){
  i18ns = {};
  I18n.find({}).exec((err, i18s) => {
    if(err) return console.error(err);
    i18s.forEach(i18n => {
      i18ns[i18n.key] = i18n.translations;
    })
  })
}

if(!i18ns) {
  load();
}

function I18N() {
}

I18N.get = function(key, lang) {
  const i18n = i18ns[key];
  if(i18n){
    const ret  = i18n[lang];
    return ret? ret : i18n.en;
  }
  else
    return key;
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

module.exports = I18N;



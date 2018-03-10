'use strict';

const _ = require('lodash');
const I18n = require('./i18n.model.js');
const i18n = require('../../components/i18n');
const googleTranslate = require('@google-cloud/translate');
const limit = require("simple-rate-limiter");

const Translate = googleTranslate({
  projectId: 'this-1000',
  keyFilename: './server/config/keys/this-1000-vision.json'
});

function translate(to) {
  const callTranslateApi = limit(function(category_name, callback) {
    Translate.translate(category_name, to, callback);
  }).to(20).per(1000);

  const cursor = I18n.find({}).cursor();
  cursor.eachAsync(i18n => {
    callTranslateApi(i18n.enUS, function(err, translation) {
      if (err) return console.log(err.message);
      let translations = i18n.translations;
      let newTranslations = {};
      Object.keys(translations).forEach(key => {
        newTranslations[key] = translations[key];
      });
      newTranslations[to] = translation;
      i18n.translations = newTranslations;

      i18n.save(function (err, i18n) {
        if (err) return console.log(err.message);
        console.log(`saving ${i18n.name} translation to ${to} is ${translation}`);
      });
    });
  });
}

exports.test = function (req, res) {
  return res.status(200).send('OK');
};

exports.term = function (req, res) {
  return res.status(200).send(i18n.get(req.params.key, req.params.lang));
};
exports.load = function (req, res) {
  i18n.load();
  return res.status(200);
};

exports.translateAPI = function (req, res) {
  translate(req.params.to);
  return res.status(200).send(`translation to ${req.params.to} has started`);
};

// Get list of i18ns
exports.index = function(req, res) {
  I18n.find(function (err, i18ns) {
    if(err) { return handleError(res, err); }
    return res.json(200, i18ns);
  });
};

// Get a single i18n
exports.show = function(req, res) {
  I18n.findById(req.params.id, function (err, i18n) {
    if(err) { return handleError(res, err); }
    if(!i18n) { return res.send(404); }
    return res.json(i18n);
  });
};

function getToLanguages() {
  let languages = require('./strings/languages.json');
  return Object.values(languages);
}

exports.createI18N = function(req, res) {
  const strings = require('./strings/strings.json');
  Object.entries(strings).forEach(([key, enUS]) => {
      console.log('translating key: ', key, 'with value: ', enUS);
      I18n.create({key, enUS, translations:{ en: enUS}}, function(err, i18n) {
        if (err) return handleError(res, err);
        getToLanguages().forEach(to => {
          const callTranslateApi = limit(function (category_name, callback) {
            Translate.translate(category_name, to, callback);
          }).to(20).per(1000);

          callTranslateApi(i18n.enUS, function (err, translation) {
            if (err) return console.log(err.message);
            let translations = i18n.translations;
            let newTranslations = {};
            Object.keys(translations).forEach(key => {
              newTranslations[key] = translations[key];
            });
            newTranslations[to] = translation;
            i18n.translations = newTranslations;

            i18n.save(function (err, i18n) {
              if (err) return console.log(err.message);
              console.log(`saving ${i18n.enUS} translation to ${to} is ${translation}`);
            });
          });
        });
      })
    });
  return res.status(201).json(strings);
};


// Creates a new i18n in the DB.
exports.create = function(req, res) {
  I18n.create(req.body, function(err, i18n) {
    if(err) { return handleError(res, err); }
    return res.json(201, i18n);
  });
};

// Updates an existing i18n in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  I18n.findById(req.params.id, function (err, i18n) {
    if (err) { return handleError(res, err); }
    if(!i18n) { return res.send(404); }
    let updated = _.merge(i18n, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, i18n);
    });
  });
};

// Deletes a i18n from the DB.
exports.destroy = function(req, res) {
  I18n.findById(req.params.id, function (err, i18n) {
    if(err) { return handleError(res, err); }
    if(!i18n) { return res.send(404); }
    i18n.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

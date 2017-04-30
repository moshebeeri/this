// The project ID to use, e.g. "your-project-id"
// const projectId = "lowla-thiscount";

// The name of the file from which data should be imported, e.g. "/path/to/file.csv"
// const filename = "/path/to/file.csv";

// The ID of the dataset of the table into which data should be imported, e.g. "my_dataset"
const datasetId = "my_dataset";

// The ID of the table into which data should be imported, e.g. "my_table"
const tableId = "my_table";


var bigquery = require('@google-cloud/bigquery')({
  projectId: 'lowla-thiscount',
  keyFilename: 'lowla-45ce78efca49.json'
});

(function() {
  'use strict';

  /*  const assign = require('object-assign');
   const vary = require('vary');

   const defaults = {
   origin: '*',
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   preflightContinue: false,
   optionsSuccessStatus: 204,
   helloWorld: 'hello world'
   };*/


  function insertRows(rows) {
  // Inserts data into a table
    bigquery
      .dataset(datasetId)
      .table(tableId)
      .insert(rows)
      .then((insertErrors) => {
        console.log('Inserted:');
        rows.forEach((row) => console.log(row));

        if (insertErrors && insertErrors.length > 0) {
          console.log('Insert errors:');
          insertErrors.forEach((err) => console.error(err));
        }
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  }

  function loadFile(filename) {
    let job;

    // Imports data from a local file into the table
    bigquery
      .dataset(datasetId)
      .table(tableId)
      .import(filename)
      .then((results) => {
        job = results[0];
        console.log(`Job ${job.id} started.`);
        return job.promise();
      })
      .then((results) => {
        console.log(`Job ${job.id} completed.`);
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });

  }

  exports.loadFile = loadFile;
  exports.insertRows = insertRows;
}());

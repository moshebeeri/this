
'use strict';
var bigquery = require('@google-cloud/bigquery')({
  projectId: 'lowla-thiscount',
  keyFilename: 'lowla-45ce78efca49.json'
});

//TODO: use to exec with query from last id
//export GOOGLE_APPLICATION_CREDENTIALS=/home/moshe/install/mongobq-master/lowla-7b578e2ebcfe.json
//bin/mongobq --host low.la -d lowla-dev -c promotions -P "lowla-thiscount" -D promotions -T all -B lowla_bucket


// The project ID to use, e.g. "your-project-id"
// const projectId = "lowla-thiscount";

// The name of the file from which data should be imported, e.g. "/path/to/file.csv"
// const filename = "/path/to/file.csv";

// The ID of the dataset of the table into which data should be imported, e.g. "my_dataset"

function BigQuery(options) {
  this.prototype.datasetId = options.datasetId | "promotions";
  this.prototype.tableId = options.tableId | "log";
}

BigQuery.insertRows =
  BigQuery.prototype.insertRows = function(rows) {
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
  };

BigQuery.loadFile =
  BigQuery.prototype.loadFile = function(rows) {
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

  };

module.exports = BigQuery;

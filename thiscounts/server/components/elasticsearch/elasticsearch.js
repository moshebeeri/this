'use strict';

let elasticsearch = require('elasticsearch');
let config = require('../../config/environment');

let client = new elasticsearch.Client( config.elasticsearch );
let perPage = 50;

function Elasticsearch() {

}

Elasticsearch.prototype.search = function search(query, pageNum, callback) {
  let searchParams = {
    index: config.elasticsearch.index,
    from: (pageNum - 1) * perPage,
    size: perPage,
    body: {
      query: {
        filtered: {
          query: {
            match: {
              _all: query
            }
          }
        }
      }
    }
  };
  client.search(searchParams, function (err, res) {
    if (err) return callback(err, null);
    return callback(null, {
      results: res.hits.hits,
      page: pageNum,
      pages: Math.ceil(res.hits.total / perPage)
    });
  })
};


Elasticsearch.prototype.demo_search = function demo_search(request, callback) {
  let pageNum = request.params.page;
  let perPage = request.params.per_page;
  let userQuery = request.params.search_query;
  let userId = request.session.userId;

  let searchParams = {
    index: 'posts',
    from: (pageNum - 1) * perPage,
    size: perPage,
    body: {
      query: {
        filtered: {
          query: {
            match: {
              // match the query agains all of
              // the fields in the posts index
              _all: userQuery
            }
          },
          filter: {
            // only return documents that are
            // public or owned by the current user
            or: [
              {
                term: { privacy: "public" }
              },
              {
                term: { owner: userId }
              }
            ]
          }
        }
      }
    }
  };
  client.search(searchParams, function (err, res) {
    if (err) {
      // handle error
      throw err;
    }

    response.render('search_results', {
      results: res.hits.hits,
      page: pageNum,
      pages: Math.ceil(res.hits.total / perPage)
    });
  });
};

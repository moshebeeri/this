/**
 * @providesModule react-native-link-preview
 */

const cheerio = require('cheerio');
const urlObj = require('url');
const { fetch } = require('cross-fetch');

const regex_valid_url = new RegExp(
  "^" +
  // protocol identifier
  "(?:(?:https?|ftp)://)" +
  // user:pass authentication
  "(?:\\S+(?::\\S*)?@)?" +
  "(?:" +
  // IP address exclusion
  // private & local networks
  "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
  "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
  "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
  // IP address dotted notation octets
  // excludes loopback network 0.0.0.0
  // excludes reserved space >= 224.0.0.0
  // excludes network & broacast addresses
  // (first & last IP address of each class)
  "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
  "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
  "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
  "|" +
  // host name
  "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
  // domain name
  "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
  // TLD identifier
  "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
  // TLD may end with dot
  "\\.?" +
  ")" +
  // port number
  "(?::\\d{2,5})?" +
  // resource path
  "(?:[/?#]\\S*)?" +
  "$", "i"
);

exports.getPreview = function(text, options) {
  return new Promise((resolve, reject) => {
    if (!text) {
      reject({
        error: 'Link-Preview did not receive either a url or text'
      });
    }
    let detectedUrl = null;
    text.split(' ').forEach(token => {
      if (regex_valid_url.exec(token) && !detectedUrl) {
        detectedUrl = token;
      }
    });

    if (detectedUrl) {
      fetch(detectedUrl)
        .then(response => response.text())
        .then(text => {
          resolve(parseResponse(text, detectedUrl, options || {}));
        })
        .catch(error => reject({ error }));
    } else {
      reject({
        error: 'Preview-Link did not find a link in the text'
      });
    }
  });
};

function parseResponse(body, url, options) {
  const doc = cheerio.load(body);
  return {
    url,
    title: getTitle(doc),
    description: getDescription(doc),
    mediaType: getMediaType(doc) || 'website',
    images: getImages(doc, url, options.imagesPropertyType),
    videos: getVideos(doc)
  };
}

function getTitle(doc) {
  let title = doc("meta[property='og:title']").attr('content');

  if (!title) {
    title = doc('title').text();
  }

  return title;
}

function getDescription(doc) {
  let description = doc('meta[name=description]').attr('content');

  if (description === undefined) {
    description = doc('meta[name=Description]').attr('content');
  }

  if (description === undefined) {
    description = doc("meta[property='og:description']").attr('content');
  }

  return description;
}

function getMediaType(doc) {
  const node = doc('meta[name=medium]');

  if (node.length) {
    const content = node.attr('content');
    return content === 'image' ? 'photo' : content;
  } else {
    return doc("meta[property='og:type']").attr('content');
  }
}

function getImages(doc, rootUrl, imagesPropertyType) {
  let images = [],
    nodes,
    src,
    dic;

  nodes = doc(`meta[property='${imagesPropertyType || 'og'}:image']`);

  if (nodes.length) {
    nodes.each((index, node) => {
      src = node.attribs.content;
      if (src) {
        src = urlObj.resolve(rootUrl, src);
        images.push(src);
      }
    });
  }

  if (images.length <= 0 && !imagesPropertyType) {
    src = doc('link[rel=image_src]').attr('href');
    if (src) {
      src = urlObj.resolve(rootUrl, src);
      images = [src];
    } else {
      nodes = doc('img');

      if (nodes.length) {
        dic = {};
        images = [];
        nodes.each((index, node) => {
          src = node.attribs.src;
          if (src && !dic[src]) {
            dic[src] = 1;
            // width = node.attribs.width;
            // height = node.attribs.height;
            images.push(urlObj.resolve(rootUrl, src));
          }
        });
      }
    }
  }

  return images;
}

function getVideos(doc) {
  const videos = [];
  let nodeTypes;
  let nodeSecureUrls;
  let nodeType;
  let nodeSecureUrl;
  let video;
  let videoType;
  let videoSecureUrl;
  let width;
  let height;
  let videoObj;
  let index;

  const nodes = doc("meta[property='og:video']");
  const length = nodes.length;

  if (length) {
    nodeTypes = doc("meta[property='og:video:type']");
    nodeSecureUrls = doc("meta[property='og:video:secure_url']");
    width = doc("meta[property='og:video:width']").attr('content');
    height = doc("meta[property='og:video:height']").attr('content');

    for (index = 0; index < length; index++) {
      video = nodes[index].attribs.content;

      nodeType = nodeTypes[index];
      videoType = nodeType ? nodeType.attribs.content : null;

      nodeSecureUrl = nodeSecureUrls[index];
      videoSecureUrl = nodeSecureUrl ? nodeSecureUrl.attribs.content : null;

      videoObj = {
        url: video,
        secureUrl: videoSecureUrl,
        type: videoType,
        width,
        height
      };
      if (videoType.indexOf('video/') === 0) {
        videos.splice(0, 0, videoObj);
      } else {
        videos.push(videoObj);
      }
    }
  }

  return videos;
}

// const parseMediaResponse = function(res, contentType, url) {
//   if (contentType.indexOf('image/') === 0) {
//     return createResponseData(url, false, '', '', contentType, 'photo', [url]);
//   } else {
//     return createResponseData(url, false, '', '', contentType);
//   }
// }

// Get raw image url rather than a link to the imgur page
function imageUrl(url) {
  if (!url) {
    return;
  }

  const ext = this.getExtension(url);

  if (ext === '') {
    return `${url}.jpg`;
  }

  if (ext === 'gifv') {
    return url.slice(0, -1);
  }

  return url;
}

function getExtension(url) {
  if (!url) {
    return;
  }

  var lastPathSegment = url.substr(url.lastIndexOf('/') + 1);
  var extension = lastPathSegment.substr(lastPathSegment.lastIndexOf('.') + 1);

  if (lastPathSegment === extension) {
    return '';
  }

  return extension;
}

function addHttps(url) {
  if (!url) {
    return url;
  }

  if (url.substr(0, 5) === 'http:') {
    url = 'https:' + url.substr(5);
  }

  return url;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// Only export if not in browser
if (typeof module === 'object') {
  module.exports = {
    imageUrl,
    getExtension,
    getRandomInt,
    addHttps,
    shuffleArray,
  };
}

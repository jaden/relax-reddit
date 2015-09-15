// Get an actual image url rather than link to imgur page
function imageUrl(url) {
    if (! url) {
        return url;
    }

    var ext = this.getExtension(url);

    if (ext === '') {
        return url + '.jpg';
    }

    if (ext === 'gifv') {
        return url.slice(0, -1);
    }

    return url;
}

function getExtension(url) {
    if (! url) {
        return url;
    }

    var lastPathSegment = url.substr(url.lastIndexOf('/') + 1);
    var extension = lastPathSegment.substr(lastPathSegment.lastIndexOf('.') + 1);

    if (lastPathSegment === extension) {
        return '';
    }

    return extension;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Only export if not in browser
if (typeof module === 'object') {
    module.exports = {
        imageUrl: imageUrl,
        getExtension: getExtension,
        getRandomInt: getRandomInt
    };
}
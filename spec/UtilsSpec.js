var utils = require('../utils');

describe("imageUrl()", function() {

  it("should handle empty string", function() {
    expect(utils.imageUrl('')).toEqual('');
  });

  it("should handle undefined", function() {
    expect(utils.imageUrl()).toEqual(undefined);
  });

  it("should leave correct URL alone", function() {
    var url = 'http://i.imgur.com/K8v9RgV.jpg';
    expect(utils.imageUrl(url)).toEqual(url);
  });

  it("should add missing jpg extension", function() {
    var url = 'http://imgur.com/K8v9RgV';
    expect(utils.imageUrl(url)).toEqual(url + '.jpg');
  });

  it("should convert gifv extension to gif", function() {
    var url = 'http://imgur.com/K8v9RgV';
    expect(utils.imageUrl(url + '.gifv')).toEqual(url + '.gif');
  });
});

describe("getExtension()", function() {

  it("should handle empty string", function() {
    expect(utils.getExtension('')).toEqual('');
  });

  it("should handle undefined", function() {
    expect(utils.getExtension()).toEqual(undefined);
  });

  it("should get the jpg extension", function() {
    expect(utils.getExtension('http://example.com/test.jpg')).toEqual('jpg');
  });

  it("should get the gifv extension", function() {
    expect(utils.getExtension('http://example.com/test.gifv')).toEqual('gifv');
  });

  it("should get the gif extension", function() {
    expect(utils.getExtension('http://example.com/test.gif')).toEqual('gif');
  });
});

describe("getRandomInt()", function() {

  it("should return a number less than the max", function() {
    var max = 2;
    for (var i = 0; i < 10; i++) {
      expect(utils.getRandomInt(max)).toBeLessThan(max);
    }
  });

  it("should be non-negative", function() {
    var max = 2;
    for (var i = 0; i < 10; i++) {
      expect(utils.getRandomInt(max)).toBeGreaterThan(-1);
    }
  });
});
// Create mock objects.
var SC     = {},
    tracks = [ {id: 0},
               {id: 1},
               {id: 2}
             ];

SC.initialize = function() {};
SC.get = function(track, options, callback) {
  callback(tracks);
};
SC.stream = function(track, callback) {};

var _ = {};
_.shuffle = function(array) {
  return array;
};

var SoundPlayer = require('../SoundPlayer');

describe("playNewTrack()", function() {

  var player;

  beforeEach(function() {
    player = new SoundPlayer(SC, _);
  });

  it("with empty tracks should retrieve new tracks", function() {
    player.playNewTrack(function() {});
    expect(player.tracks).toBeDefined();
    expect(player.tracks.length).toEqual(3);
  });

});

describe("getNextTrack()", function() {

  var player;

  beforeEach(function() {
    player = new SoundPlayer(SC, _);
    player.tracks = tracks;
  });

  it("should return the first track on first call", function() {
    var track = player.getNextTrack(function() {});
    expect(track.id).toEqual(0);
    expect(player.currentIndex).toEqual(1);
  });

  it("should cycle through all tracks and start over", function() {
    var track = player.getNextTrack(function() {});
    track = player.getNextTrack(function() {});
    expect(track.id).toEqual(1);

    track = player.getNextTrack(function() {});
    expect(track.id).toEqual(2);

    track = player.getNextTrack(function() {});
    expect(track.id).toEqual(0);
  });

});
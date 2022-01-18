function SoundPlayer(SC, _) {
    this.SC = SC;
    this._ = _;

    this.SC.initialize({
        client_id: 'd8c4984b4e6b9038bdf5f16703eed079'
    });

    this.currentIndex = 0;
}

SoundPlayer.prototype.playNewTrack = function(callback) {

    if (! this.tracks) {
        this.SC.get('/tracks', { q: 'soothing', tags: 'instrumental', bpm: { to: 60 } }, function(tracks) {
            this.tracks = this._.shuffle(tracks);
            this.playTrack(callback);
        }.bind(this));
    } else {
        this.playTrack(callback);
    }
};

SoundPlayer.prototype.getNextTrack = function() {
    return this.tracks[this.currentIndex++ % this.tracks.length];
};

SoundPlayer.prototype.playTrack = function(callback) {
    this.track = this.getNextTrack();

    callback(this.track);

    this.SC.stream("/tracks/" + this.track.id, function(controls) {
        this.setControls(controls);
        this.play();
    }.bind(this));
};

SoundPlayer.prototype.isPlaying = function() {
    if (this.controls && this.controls.getState() === 'playing') {
        return true;
    }

    return false;
};

SoundPlayer.prototype.playNewTrackIfEnded = function(callback) {
    if (this.controls && this.controls.getState() === 'ended') {
        this.playNewTrack(callback);
    }
};

SoundPlayer.prototype.setControls = function(controls) {

    if (this.controls) {
        this.controls.stop();
    }

    this.controls = controls;
};

SoundPlayer.prototype.play = function(callback) {
    if (this.controls) {
        this.controls.setVolume(0.2);
        this.controls.play();
    } else {
        this.playNewTrack(callback);
    }
};

SoundPlayer.prototype.stop = function() {
    if (this.controls) {
        this.controls.stop();
    }
};

SoundPlayer.prototype.pause = function() {
    if (this.controls) {
        this.controls.pause();
    }
};

// Only export if not in browser
if (typeof module === 'object') {
    module.exports = SoundPlayer;
}
function SoundPlayer() {
	SC.initialize({
  		client_id: 'd8c4984b4e6b9038bdf5f16703eed079'
	});
}

SoundPlayer.prototype.playNewTrack = function(callback) {

	var self = this;

	SC.get('/tracks', { q: 'soothing', tags: 'instrumental', bpm: { to: 60 } }, function(tracks) {
  		self.track = tracks[getRandomInt(tracks.length)];

  		SC.stream("/tracks/" + self.track.id, function(controls) {
			self.setControls(controls);
			self.play();
		});

		callback(self.track);
	});
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
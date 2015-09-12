var	BGS_COUNT    = 100,
    QUOTES_COUNT = 100;

window.vue = new Vue({
	el: '#container',

	data: {
		backgrounds: [],
		background: '',
		backgroundImage: '',
		cachedBackground: '',
		cachedBackgroundImage: '',
		quotes: [],
		quote: '',
		musicPlaying: false,
		currentTrack: '',
		soundPlayer: null,
		refresh: null,
		refreshInterval: 15000,
	},

	created: function () {

		this.loadBackgroundImages();
		this.loadQuotes();
		this.toggleRefresh();
	},

	methods: {

		loadBackgroundImages: function() {

			$.getJSON("https://www.reddit.com/r/earthporn/top.json?sort=top&t=all&limit=" + BGS_COUNT, function(json) {

				this.backgrounds = json.data.children;
				this.chooseBackgroundImage();

			}.bind(this));
		},

		chooseBackgroundImage: function() {

			this.cachedBackground      = this.getRandomBackground();
			this.cachedBackgroundImage = imageUrl(this.cachedBackground.url);

			// Handle first page load
			if (! this.background) {
				this.background = this.getRandomBackground();
			} else {
				this.background = this.cachedBackground;
			}

			this.backgroundImage = this.getBackgroundImageUrl();
		},

		getRandomBackground: function() {
			return this.backgrounds[getRandomInt(BGS_COUNT)].data;
		},

		getBackgroundImageUrl: function() {
			var path = 'url('
				+ imageUrl(this.background.url)
				+ ')';

			return path;
		},

		loadQuotes: function() {

			$.getJSON("https://www.reddit.com/r/quotes/top.json?sort=top&t=all&limit=" + QUOTES_COUNT, function(json) {

				this.quotes = json.data.children;
				this.chooseQuote(false);

			}.bind(this));
		},

		chooseQuote: function(fade) {

			if (! fade) {
				this.quote = this.quotes[getRandomInt(QUOTES_COUNT)].data;
				return;
			}

			// TODO Use v-transition instead of jQuery http://vuejs.org/guide/transitions.html#CSS_Transitions
			$('#quote').fadeOut(2000, function() {
				this.quote = this.quotes[getRandomInt(QUOTES_COUNT)].data;
				$('#quote').fadeIn(2000);
			}.bind(this));
		},

		togglePlaying: function() {

			if (! this.soundPlayer) {
				this.soundPlayer = new SoundPlayer();
			}

			if (this.soundPlayer.isPlaying())
			{
				this.soundPlayer.pause();
				this.musicPlaying = false;
			}
			else {
				this.soundPlayer.play(this.setTrack);
				this.musicPlaying = true;
			}
		},

		toggleRefresh: function() {
			if (this.refresh) {
				clearTimeout(this.refresh);
				this.refresh = null;
				return;
			}

			this.refresh = setInterval(function() {

				this.chooseBackgroundImage();
				this.chooseQuote(true);

				if (this.musicPlaying) {
					this.soundPlayer.playNewTrackIfEnded(this.setTrack);
				}

			}.bind(this), this.refreshInterval);
		},

		newTrack: function() {
			this.musicPlaying = true;
			this.soundPlayer.playNewTrack(this.setTrack);
		},

		// Callback for playNewTrack or play
		setTrack: function(track) {
			this.currentTrack = track;
		},
	},

	computed: {
		playOrPauseText: function() {
			return (this.musicPlaying)
				? 'Pause'
				: 'Play';
		},

		stopRefreshingText: function() {
			return (this.refresh)
				? 'Stop'
				: 'Resume';
		}
	},
});

// Get an actual image url rather than link to imgur page
function imageUrl(url) {
	if (! url) {
		return url;
	}

	var ext = getExtension(url);

	if (ext === '') {
		return url + '.jpg';
	}

	if (ext === 'gifv') {
		return url + 'gif';
	}

	return url;
}

function getExtension(url) {
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
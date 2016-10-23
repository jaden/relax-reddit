var BGS_COUNT    = 100,
    QUOTES_COUNT = 100;

var vm = new Vue({
    el: '#container',

    data: {
        backgrounds: [],
        backgroundIndex: 0,
        background: '',
        backgroundImage: '',
        cachedBackground: '',
        cachedBackgroundImage: '',
        quotes: [],
        quoteIndex: 0,
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

            jQuery.getJSON("https://www.reddit.com/r/earthporn/top.json?sort=top&t=all&limit=" + BGS_COUNT, function(json) {

                this.backgrounds = _.shuffle(json.data.children);
                this.backgrounds = this.backgrounds.map(function (background) {
                    background.data.url = addHttps(background.data.url);
                    return background;
                });

                this.chooseBackgroundImage();

            }.bind(this));
        },

        chooseBackgroundImage: function() {

            this.cachedBackground      = this.getNextBackground();
            this.cachedBackgroundImage = imageUrl(this.cachedBackground.url);

            // Handle first page load
            if (! this.background) {
                this.background = this.getNextBackground();
            } else {
                this.background = this.cachedBackground;
            }

            this.backgroundImage = this.getBackgroundImageUrl();
        },

        getNextBackground: function() {
            return this.backgrounds[this.backgroundIndex++ % this.backgrounds.length].data;
        },

        getBackgroundImageUrl: function() {
            var path = 'url(' +
                imageUrl(this.background.url) +
                ')';

            return path;
        },

        loadQuotes: function() {

            jQuery.getJSON("https://www.reddit.com/r/quotes/top.json?sort=top&t=all&limit=" + QUOTES_COUNT, function(json) {

                this.quotes = _.shuffle(json.data.children);
                this.chooseQuote(false);

            }.bind(this));
        },

        chooseQuote: function(fade) {

            if (! fade) {
                this.quote = this.getNextQuote();
                return;
            }

            // TODO Use v-transition instead of jQuery http://vuejs.org/guide/transitions.html#CSS_Transitions
            jQuery('#quote').fadeOut(2000, function() {
                this.quote = this.getNextQuote();
                jQuery('#quote').fadeIn(2000);
            }.bind(this));
        },

        getNextQuote: function() {
            return this.quotes[this.quoteIndex++ % this.quotes.length].data;
        },

        togglePlaying: function() {

            if (! this.soundPlayer) {
                this.soundPlayer = new SoundPlayer(SC, _);
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
            return (this.musicPlaying) ?
                'Pause' : 'Play';
        },

        stopRefreshingText: function() {
            return (this.refresh) ?
                'Stop' : 'Resume';
        }
    },
});
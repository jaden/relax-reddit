const BGS_COUNT = 100;
const QUOTES_COUNT = 100;

new Vue({
  el: '#app',

  data: {
    isReady: false,
    backgrounds: [],
    backgroundIndex: 0,
    background: '',
    backgroundImage: '',
    cachedBackground: '',
    cachedBackgroundImage: '',
    quotes: [],
    quoteIndex: 0,
    quote: '',
    refresh: null,
    refreshInterval: 15000,
  },

  mounted: async function () {
    await this.loadBackgroundImages();
    await this.loadQuotes();
    await this.toggleRefresh();
    this.isReady = true;
  },

  methods: {
    loadBackgroundImages: async function () {
      const response = await fetch(`https://www.reddit.com/r/earthporn/top.json?sort=top&t=all&limit=${BGS_COUNT}`);
      const json = await response.json();
      this.backgrounds = shuffleArray(json.data.children);
      this.backgrounds = this.backgrounds.map(function (background) {
        background.data.url = addHttps(background.data.url);
        return background;
      });

      this.chooseBackgroundImage();
    },

    chooseBackgroundImage: function () {
      this.cachedBackground = this.getNextBackground();
      this.cachedBackgroundImage = imageUrl(this.cachedBackground.url);

      // Handle first page load
      if (!this.background) {
        this.background = this.getNextBackground();
      } else {
        this.background = this.cachedBackground;
      }

      this.backgroundImage = this.getBackgroundImageUrl();
    },

    getNextBackground: function () {
      return this.backgrounds[this.backgroundIndex++ % this.backgrounds.length].data;
    },

    getBackgroundImageUrl: function () {
      return `url(${imageUrl(this.background.url)})`;
    },

    loadQuotes: async function () {
      const response = await fetch(`https://www.reddit.com/r/quotes/top.json?sort=top&t=all&limit=${QUOTES_COUNT}`);
      const json = await response.json();
      this.quotes = shuffleArray(json.data.children);
      this.quote = this.quotes[this.quoteIndex++ % this.quotes.length].data;
    },

    getNextQuote: function () {
      const element = document.querySelector('#quote');

      element.classList.remove('fade-in');
      element.classList.add('fade-out');

      setTimeout(function () {
        element.classList.add('fade-in');
        this.quote = this.quotes[this.quoteIndex++ % this.quotes.length].data;
        element.classList.remove('fade-out');
      }.bind(this), 5000); // This time should match the animation time in CSS for fade-in and fade-out
    },

    toggleRefresh: function () {
      if (this.refresh) {
        clearTimeout(this.refresh);
        this.refresh = null;
        return;
      }

      this.refresh = setInterval(function () {
        this.chooseBackgroundImage();
        this.getNextQuote();
      }.bind(this), this.refreshInterval);
    },
  },

  computed: {
    stopRefreshingText: function () {
      return this.refresh ? 'Stop' : 'Resume';
    }
  },
});

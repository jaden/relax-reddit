const BGS_COUNT = 100;
const QUOTES_COUNT = 100;

const app = Vue.createApp({
  data() {
    return {
      isReady: false,
      backgrounds: [],
      backgroundIndex: 0,
      background: '',
      backgroundImage: '',
      quotes: [],
      quoteIndex: 0,
      quote: '',
      refresh: null,
      refreshInterval: 15000,
    };
  },

  mounted: async function () {
    await this.loadBackgroundImages();
    await this.loadQuotes();
    await this.toggleRefresh();

    // Remove the loading div
    document.querySelector('#loading').remove();
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
      this.background = this.getNextBackground();
      this.backgroundImage = `url(${imageUrl(this.background.url)})`;
    },

    getNextBackground: function () {
      const nextBackground = this.backgrounds[this.backgroundIndex++ % this.backgrounds.length].data;

      // Load next image so it's cached to avoid the flash of white when switching
      new Image().src = imageUrl(this.backgrounds[this.backgroundIndex % this.backgrounds.length].data.url);

      return nextBackground;
    },

    loadQuotes: async function () {
      const response = await fetch(`https://www.reddit.com/r/quotes/top.json?sort=top&t=all&limit=${QUOTES_COUNT}`);
      const json = await response.json();
      this.quotes = shuffleArray(json.data.children);
      this.quote = this.quotes[this.quoteIndex++ % this.quotes.length].data;
    },

    getNextQuote: function () {
      const element = document.querySelector('#quote');

      element.classList.remove('visible');
      element.classList.add('hidden');

      setTimeout(function () {
        this.quote = this.quotes[this.quoteIndex++ % this.quotes.length].data;
        element.classList.remove('hidden');
        element.classList.add('visible');
      }.bind(this), 5000); // This time should match the transition time in CSS for #quote
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

app.mount('#app');

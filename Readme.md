# RelaxReddit

[Demo](http://relaxreddit.snapmagic.com)

RelaxReddit was inspired by [ShowerThoughts](http://jaja321.github.io/ShowerThoughts/) ([source code](https://github.com/Jaja321/ShowerThoughts)). But instead of pulling quotes from the /r/ShowerThoughts subreddit, RelaxReddit pulls from /r/quotes. It also loads music (optionally) from SoundCloud.

Background music is turned off by default. To start it, use the **Play Music** button on the top right.

To pause the quotes and images from refreshing, use the Stop **Refreshing** button.

Credits for the quotes, images and music are in the bottom right corner.

## Development

RelaxReddit is built with [Vue.js](http://vuejs.org/), jQuery and Underscore.

To use browser-sync to run a dev server, run `npm run dev`.

To run linter on Javascript files: `npm run lint`

To run unit tests: `jasmine` OR `npm run tests`
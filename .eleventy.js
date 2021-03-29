const htmlMinTransform = require('./src/transforms/html-min-transform.js');

module.exports = (config) => {
  config.addTransform('htmlmin', htmlMinTransform);

  // Set directories to pass through to the dist folder
  // config.addPassthroughCopy('./src/css/');
  config.addPassthroughCopy('./src/media/');
  config.addPassthroughCopy('./src/js/');

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  // Custom filters
  config.addFilter('glslminify', function mini(str) {
    // this trims whitespaces, strips comments, removes newlines
    return str
      .replace(/\/\*(.|[\n\t])*\*\//g, '')
      .split('\n')
      .map((line) => {
        const trimmed = line
          .trim()
          .replace(/\s*(\W)\s*/g, '$1')
          .replace(/\/\/.*$/, '');
        // directives like #define need a newline
        return trimmed.startsWith('#') ? trimmed + '\n' : trimmed;
      })
      .filter((line) => !line.startsWith('//'))
      .join('');
  });

  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'public',
    },
  };
};

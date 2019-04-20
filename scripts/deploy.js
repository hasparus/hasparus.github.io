const { execSync } = require('child_process');
const ghpages = require('gh-pages');

execSync('cp README.md build');

ghpages.publish('build', {
  branch: 'master',
});

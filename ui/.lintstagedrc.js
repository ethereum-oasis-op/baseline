module.exports = {
  '*.{json,css,scss,html}': ['prettier --write', 'git add'],
  '*.md': ['prettier --write', 'markdownlint', 'git add'],
  '*.js': ['eslint --fix', 'git add'],
  
};

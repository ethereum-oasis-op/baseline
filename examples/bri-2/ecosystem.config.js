module.exports = {
  apps : [{
    name: 'commit-mgr',
    script: 'commit-mgr/dist/index.js',
    watch: ["."],
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : [".git", "contracts", "dist", "commit-mgr", "node_modules", "logs", "dashboard", "did"],
  },{
    name: 'dashboard',
    script: 'dashboard/node_modules/next/dist/bin/next',
    args: 'start',
    cwd: './dashboard',
  },{
    name: 'did-server',
    script: 'did/build/index.js',
    args: 'daf server',
  }]
};

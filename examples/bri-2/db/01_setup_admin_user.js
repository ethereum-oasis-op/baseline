this.db.createUser({
  user: 'admin',
  pwd: 'password123',
  roles: [
    { role: 'userAdmin', db: 'baseline' },
    { role: 'dbAdmin', db: 'baseline' },
    { role: 'readWrite', db: 'baseline' },
  ],
});

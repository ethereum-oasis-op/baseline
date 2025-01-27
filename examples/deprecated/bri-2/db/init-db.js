// Delete mounted volumes to force this to run on container startup

print('***** Start creating databases *****');

db = db.getSiblingDB('workflow-mgr');
db.createUser({
  user: 'workflow-user',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'workflow-mgr' },
  ],
});

db = db.getSiblingDB('commit-mgr');
db.createUser({
  user: 'commit-user',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'commit-mgr' },
  ],
});

db = db.getSiblingDB('zkp-mgr');
db.createUser({
  user: 'zkp-user',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'zkp-mgr' },
  ],
});

print('***** End creating databases *****');
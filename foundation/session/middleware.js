import session from 'express-session';


export default (option) => {
  let store = null;

  if ( ! option.store || option.store.driver === 'memory') {
    const MemoryStore = require('memorystore')(session);
    store = new MemoryStore(option.store.option);
  } else if (option.store.driver === 'redis') {
    const RedisStore  = require('connect-redis')(session);
    store = new RedisStore(option.store.option);
  }

  return session({
    secret: option.secret,
    cookie: { secure: option.https, maxAge: option.age },
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    store,
  });
};

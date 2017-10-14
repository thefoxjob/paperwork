import session from 'express-session';


export default (option = {}) => {
  let store = null;

  if ( ! option || ! option.store || option.store.driver === 'memory') {
    const MemoryStore = require('memorystore')(session);
    store = new MemoryStore(option && option.store ? option.store.option : null);
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

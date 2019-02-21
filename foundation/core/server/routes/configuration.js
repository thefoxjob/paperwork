import config from 'config';


export default (app) => {
  app.use('/configuration', (request, response) => {
    response.send(Buffer.from(JSON.stringify(config.get('public'))).toString('base64'));
  });
};

import config from '../../../config';


export default (app) => {
  app.use('/configuration', (request, response) => {
    const configuration = Object.assign({}, config);
    delete configuration.secure;

    response.send(Buffer.from(JSON.stringify(configuration)).toString('base64'));
  });
};

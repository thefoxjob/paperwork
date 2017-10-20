import fs from 'fs-extra';
import path from 'path';


const execute = () => {
  fs.copy(path.resolve(__dirname, '../../templates'), path.resolve(process.cwd(), './templates'), (error) => {
    if (error) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.info(`${ path.resolve(__dirname, '../../templates') } > ${ path.resolve(process.cwd(), './templates') }`);
  });

  if ( ! fs.existsSync(path.resolve(process.cwd(), './middleware'))) {
    fs.copy(path.resolve(__dirname, '../../middleware'), path.resolve(process.cwd(), './middleware'), (error) => {
      if (error) {
        throw error;
      }

      // eslint-disable-next-line no-console
      console.info(`${ path.resolve(__dirname, '../../middleware') } > ${ path.resolve(process.cwd(), './middleware') }`);
    });
  }

  if ( ! fs.existsSync(path.resolve(process.cwd(), './pages'))) {
    fs.copy(path.resolve(__dirname, '../../pages'), path.resolve(process.cwd(), './pages'), (error) => {
      if (error) {
        throw error;
      }

      // eslint-disable-next-line no-console
      console.info(`${ path.resolve(__dirname, '../../pages') } > ${ path.resolve(process.cwd(), './pages') }`);
    });
  }

  if ( ! fs.existsSync(path.resolve(process.cwd(), './stylesheets'))) {
    fs.copy(path.resolve(__dirname, '../../stylesheets'), path.resolve(process.cwd(), './stylesheets'), (error) => {
      if (error) {
        throw error;
      }

      // eslint-disable-next-line no-console
      console.info(`${ path.resolve(__dirname, '../../stylesheets') } > ${ path.resolve(process.cwd(), './stylesheets') }`);
    });
  }

  if ( ! fs.existsSync(path.resolve(process.cwd(), './routes.js'))) {
    fs.copy(path.resolve(__dirname, '../../routes.js'), path.resolve(process.cwd(), './routes.js'), (error) => {
      if (error) {
        throw error;
      }

      // eslint-disable-next-line no-console
      console.info(`${ path.resolve(__dirname, '../../routes.js') } > ${ path.resolve(process.cwd(), './routes.js') }`);
    });
  }
};

export default execute;

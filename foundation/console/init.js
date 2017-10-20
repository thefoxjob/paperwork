import fs from 'fs-extra';
import path from 'path';


const execute = () => {
  fs.copy(path.resolve(__dirname, '../../templates'), path.resolve(process.cwd(), './templates'), (error) => {
    if (error) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.info(`${ path.resolve(__dirname, './templates') } > ${ path.resolve(process.cwd(), './templates') }`);
  });
};

export default execute;

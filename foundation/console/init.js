import copyfiles from 'copyfiles';
import path from 'path';


const execute = () => {
  copyfiles([path.resolve(__dirname, './templates'), path.resolve(process.cwd(), './templates')], () => {
    // eslint-disable-next-line no-console
    console.info(`${ path.resolve(__dirname, './templates') } > ${ path.resolve(process.cwd(), './templates') }`);
  });
};

export default execute;

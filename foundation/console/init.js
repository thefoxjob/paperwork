import fs from 'fs-extra';
import path from 'path';


const templates = [
  {
    source: '../../.templates/templates',
    destination: './templates',
    overwrite: true,
  },
  {
    source: '../../.templates/middleware',
    destination: './middleware',
  },
  {
    source: '../../.templates/pages',
    destination: './pages',
  },
  {
    source: '../../.templates/routes.js',
    destination: 'routes.js',
  },
  {
    source: '../../.templates/stylesheets',
    destination: './stylesheets',
  },
];

const execute = () => {
  templates.forEach((template) => {
    if (template.overwrite) {
      if (fs.existsSync(path.resolve(process.cwd(), template.destination))) {
        return;
      }
    }

    fs.copy(path.resolve(__dirname, template.source).replace('/dist', '/'), path.resolve(process.cwd(), template.destination), (error) => {
      if (error) {
        throw error;
      }

      // eslint-disable-next-line no-console
      console.info(`${ path.resolve(__dirname, template.source).replace('/dist', '/') } > ${ path.resolve(process.cwd(), template.destination) }`);
    });
  });
};

export default execute;

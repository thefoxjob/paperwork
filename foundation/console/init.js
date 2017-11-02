import fs from 'fs-extra';
import path from 'path';


const templates = [
  {
    source: '../../.templates/application/templates',
    destination: './application/templates/',
    overwrite: true,
  },
  {
    source: '../../.templates/application/middleware',
    destination: './application/middleware',
  },
  {
    source: '../../.templates/application/pages',
    destination: './application/pages',
  },
  {
    source: '../../.templates/application/routes.js',
    destination: './application/routes.js',
  },
  {
    source: '../../.templates/application/stylesheets',
    destination: './application/stylesheets',
  },
  {
    source: '../../.templates/.babelrc',
    destination: './.babelrc',
  },
  {
    source: '../../.templates/.eslintrc',
    destination: './.eslintrc',
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

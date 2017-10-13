import ejs from 'ejs';
import fs from 'fs';
import path from 'path';


export default {
  render: (location, data, options) => {
    let file = null;

    if (fs.existsSync(location)) {
      file = fs.readFileSync(location.replace(/\./g, '/'));
    } else {
      file = fs.readFileSync(`${ path.resolve(config.secure.template.source, location.replace(/\./g, '/')) }.ejs`);
    }

    return ejs.compile(file.toString())(data);
  },
};

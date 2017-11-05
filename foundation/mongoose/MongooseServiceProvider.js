import ServiceProvider from '@thefoxjob/js-service-provider';
import mongoose from 'mongoose';


class MongooseServiceProvider extends ServiceProvider {
  register() {
    const config = this.ioc.make('config');
    const options = config.secure.modules.mongoose;

    mongoose.connect(options.url, Object.assign(options.options, { useMongoClient: true }));

    this.ioc.bindInstance('mongoose', () => mongoose);
  }
}

export default MongooseServiceProvider;

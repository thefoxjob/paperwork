import axios from 'axios';
import storage from 'store';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';


let environment = null;

export default {
  instance: (host, record = {}) => {
    if (! environment) {
      environment = new Environment({
        network: Network.create(async (operation, variables) => {
          const token = storage.get('auth.token');
          const payloads = { query: operation.text, variables };
          const headers = {
            'Content-Type': 'application/json',
          };

          if (token) {
            headers['Authorization'] = `Bearer ${ token }`;
          }

          try {
            const response = await axios.post(host, payloads, { headers });
            return response.data;
          } catch (error) {
            // skip
            console.log(error);
          }

          return {};
        }),
        store: new Store(new RecordSource(record)),
      });
    }

    return environment;
  },
};

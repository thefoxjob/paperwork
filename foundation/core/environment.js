import fetch from 'isomorphic-fetch';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';


const source = new RecordSource();
const store = new Store(source);
const network = Network.create((operation, variables) => fetch('/graphql', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    query: operation.text,
    variables,
  }),
}).then(response => response.json()));

const environment = new Environment({ store, network });

export default environment;

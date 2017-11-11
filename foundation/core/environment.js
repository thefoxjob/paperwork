import fetch from 'isomorphic-fetch';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';


export default (host) => {
  const source = new RecordSource();
  const store = new Store(source);
  const network = Network.create((operation, variables) => fetch(`${ host || '' }/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => response.json()));

  return new Environment({ store, network });
};

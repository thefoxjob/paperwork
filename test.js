import { graphql } from 'react-relay';


const query = graphql`
  query Page {
    page(path: "/") {
      name
    }
  }
`;


console.log(query.toString());

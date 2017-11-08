/**
 * @flow
 * @relayHash 79c3331df339b3f441ecd6c18931c72d
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type ApplicationQueryResponse = {|
  +page: ?{| |};
|};
*/


/*
query ApplicationQuery(
  $path: String!
) {
  page(path: $path) {
    ...PageComponent
  }
}

fragment PageComponent on Page {
  path
  name
  meta {
    title
    description
    keyword
    image
    type
  }
  directories {
    name
    path
  }
  custom {
    script
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "path",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ApplicationQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "path",
            "variableName": "path",
            "type": "String!"
          }
        ],
        "concreteType": "Page",
        "name": "page",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "PageComponent",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "ApplicationQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "path",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "ApplicationQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "path",
            "variableName": "path",
            "type": "String!"
          }
        ],
        "concreteType": "Page",
        "name": "page",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "path",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "name",
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "PageMeta",
            "name": "meta",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "title",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "description",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "keyword",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "image",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "type",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "PageDirectory",
            "name": "directories",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "path",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "PageCustom",
            "name": "custom",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "script",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query ApplicationQuery(\n  $path: String!\n) {\n  page(path: $path) {\n    ...PageComponent\n  }\n}\n\nfragment PageComponent on Page {\n  path\n  name\n  meta {\n    title\n    description\n    keyword\n    image\n    type\n  }\n  directories {\n    name\n    path\n  }\n  custom {\n    script\n  }\n}\n"
};

module.exports = batch;

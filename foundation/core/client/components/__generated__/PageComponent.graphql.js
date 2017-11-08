/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type PageComponent = {|
  +path: ?string;
  +name: ?string;
  +meta: ?{|
    +title: ?string;
    +description: ?string;
    +keyword: ?string;
    +image: ?string;
    +type: ?string;
  |};
  +directories: ?$ReadOnlyArray<?{|
    +name: ?string;
    +path: ?string;
  |}>;
  +custom: ?{|
    +script: ?string;
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PageComponent",
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
  "type": "Page"
};

module.exports = fragment;

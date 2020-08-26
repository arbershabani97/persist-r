# persist-r

[![NPM](https://img.shields.io/npm/v/persist-r.svg)](https://www.npmjs.com/package/persist-r) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> This package is based on edy/redux-persist-transform-filter, just caching persistence is added

Filter transformator for redux-persist + persist caching

## Installation
```
  npm install persist-r
```

## Usage

```js
import { createFilter, createBlacklistFilter, persistCache } from 'persist-r';

// this works too:
import createFilter, { createBlacklistFilter, persistCache } from 'persist-r';



// you want to store only a subset of your state of reducer one
const saveSubsetFilter = createFilter(
  'myReducerOne',
  ['keyYouWantToSave1', 'keyYouWantToSave2']
);

// you want to remove some keys before you save
const saveSubsetBlacklistFilter = createBlacklistFilter(
  'myReducerTwo',
  ['keyYouDontWantToSave1', 'keyYouDontWantToSave2']
);

// you want to load only a subset of your state of reducer three
const loadSubsetFilter = createFilter(
  'myReducerThree',
  null,
  ['keyYouWantToLoad1', 'keyYouWantToLoad2']
);

// saving a subset and loading a different subset is possible
// but doesn't make much sense because you'd load an empty state
const saveAndloadSubsetFilter = createFilter(
  'myReducerFour',
  ['one', 'two']
  ['three', 'four']
);

const predicateFilter = persistFilter(
	'form',
	[
		{ path: 'one', filterFunction: (item: any): boolean => item.mustBeStored },
		{ path: 'two', filterFunction: (item: any): boolean => item.mustBeStored },
	],
	'whitelist'
)

const normalPathFilter = persistFilter(
	'form',
	['one', 'two'],
	'whitelist'
)

persistStore(store, {
  transforms: [
    saveSubsetFilter,
    saveSubsetBlacklistFilter,
    loadSubsetFilter,
    saveAndloadSubsetFilter,
    persistCache("projects")
  ]
});
```

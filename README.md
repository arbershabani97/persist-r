# persist-r

[![NPM](https://img.shields.io/npm/v/persist-r.svg)](https://www.npmjs.com/package/persist-r) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> This package is based on edy/redux-persist-transform-filter, just caching persistence is added -> `persistCache`

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
    persistCache("projects"),
    persistCache("tasks.keys")
  ]
});
```
### Persist Cache

#### Using `persistCache("projects")`
``` javascript
{
  "projects": {
    show:[1,2,3,4,5,6,7,8,9,10]
    list:{
      1: {id: 1, title: "hello"},
      2: {id: 2, title: "hello"},
      ...
      10: {id: 10, title: "hello"},
    },
    initial: [1,2,4]
  }
}
// convert it to the object down below, and save it in redux persist 
// ...so only the elements from the `initial` are saved
{
  "projects": {
    show:[1,2,4]
    list:{
      1: {id: 1, title: "hello"},
      2: {id: 2, title: "hello"},
      4: {id: 4, title: "hello"},
    },
    initial: [1,2,4]
  }
}
```
#### Using `persistCache("tasks.keys")`
``` javascript
// the case when we have project keys - 100, 101, 102
{
  "tasks": {
    100: {
      show:[1,2,3,4,5,6,7,8,9,10]
      list:{
        1: {id: 1, title: "hello"},
        2: {id: 2, title: "hello"},
        ...
        10: {id: 10, title: "hello"},
      },
      initial: [1]
    },
    101: {
      show:[1,2,3,4,5,6,7,8,9,10]
      list:{
        1: {id: 1, title: "hello"},
        2: {id: 2, title: "hello"},
        ...
        10: {id: 10, title: "hello"},
      },
      initial: [1]
    },
    102: {
      show:[1,2,3,4,5,6,7,8,9,10]
      list:{
        1: {id: 1, title: "hello"},
        2: {id: 2, title: "hello"},
        ...
        10: {id: 10, title: "hello"},
      },
      initial: [1]
    }
  }
}
// convert it to the object down below, and save it in redux persist 
// ...so only the elements from the `initial` are saved
{
  "tasks": {
    100: {
      show:[1]
      list:{
        1: {id: 1, title: "hello"},
      },
      initial: [1]
    },
    101: {
      show:[1]
      list:{
        1: {id: 1, title: "hello"},
      },
      initial: [1]
    },
    102: {
      show:[1]
      list:{
        1: {id: 1, title: "hello"},
      },
      initial: [1]
    },
  }
}
```

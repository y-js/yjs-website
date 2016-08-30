

In this tutorial we introduce the basics of Yjs. You will learn how to create a new Yjs instance, and how to use the [y-map](https://github.com/y-js/y-map) and [y-array](https://github.com/y-js/y-array) types.
We will use the websockets protocol to share changes, and use an in-memory database to persist the data. But note: there are various other options to communicate, and persist changes. Check out the [modules section](/modules) in order to find out about all the options you have!

Furthermore, you are encouraged to try out everything you find here in your browser console.
In every distribution of Yjs you'll find an `./Examples` directory that includes some simple projects.
If you have any questions, drop us a line via [gitter](https://gitter.im/y-js/yjs).

### Prerequisites
Yjs expects that you have a Promise/A+ implementation on the window/global object. Though this has been [specified in ECMAScript 2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) not all browser implement it yet. You can include any Promise/A+ compatible implementation. If you don't know which one to include, check out the [es6-promise polyfill](https://github.com/jakearchibald/es6-promise).

Yjs is tested on nodejs >= `0.10`. But in order to use it you have to enable harmony support for nodejs < `4.0.0` like this:
```
node --harmony ./yourApp.js
# or in order to start a gulp task
node --harmony $(which gulp)
```

All thats left to do is:
* Download Yjs, and the modules you want to use via bower, npm, or zip
  * In this tutorial we will use the `y-memory`, `y-websockets-client`, `y-array`, `y-map`, and `y-text` modules
  * For testing you can use the default connection point for `y-websockets-client`. For productive systems we recommend to set up your own installation (see [y-websockets-server](https://github.com/y-js/y-websockets-server)).
* Include Yjs in your app via (E.g. via `<script>` tag)

##### Using bower
```
npm install -g bower
bower install --save yjs y-memory y-websockets-client y-array y-map y-text
```

You only need to include the `y.js` file. Yjs is able to automatically require missing modules.  
```
<script src="./bower_components/yjs/y.js"></script>
```

##### Using npm
```
npm install --save yjs y-memory y-websockets-client y-array y-map y-text
```

If you don't include via script tag, you have to explicitly include all modules! (Same goes for other module systems)
```
var Y = require('yjs')
require('y-array')(Y) // add the y-array type to Yjs
require('y-websockets-client')(Y)
require('y-memory')(Y)
require('y-array')(Y)
require('y-map')(Y)
require('y-text')(Y)
// ..
// do the same for all modules you want to use
```

### Create a Yjs instance
You create a Yjs instance by calling `Y(options)`. This will return a promise, which is resolved when the connector initialized a connection.

```
Y({
  db: {
    name: 'memory' // store the shared data in memory
  },
  connector: {
    name: 'websockets-client', // use the websockets connector
    room: 'my room'
    // url: 'localhost:1234' // specify your own server destination
  },
  share: { // specify the shared content
    text: 'Text',  // y.share.text is of type Y.Text
    map: 'Map',    // y.share.map is of type Y.Map
    array: 'Array' // y.share.array is of type Y.Array
  },
  sourceDir: '/bower_components' // where the modules are
}).then(function (y) {
  // y holds all the information about the shared object
  window.y = y
  // We use y.share to access the shared types. E.g.
  y.share.text.bind(document.querySelector('textarea'))
})
```

If you don't specify a `options.connector.url`, it connects to one of the servers we provide.
The server instance maintains rooms, in which clients can share data (see [y-websockets-server](https://github.com/y-js/y-websockets-server)).
Finally, `y.share` holds the shared data. We specified three shared types (Y.Text, Y.Map, and Y.Array) that we use in this tutorial.

# Yjs types
In the Yjs project, we strongly distinguish between *data type* and *data structure*.
Yjs knows how to handle concurrency on several data structures like Hash-Maps, Trees, Lists, and Graphs.
You can create data types with the given structures. In the [modules section](/modules)
we list a bunch of existing types that you can use in your projects.

### Y.Map type
Y.Map maps from strings to arbitrary values. Just make sure, that it is possible to convert the value to a string (using 'JSON.stringify').
Lets manipulate `y.share.map`: Call `y.share.map.set('propertyName', 42)` in order to set a primitive value on your shared map type.
The change will be available to all clients in the same room. You can retrieve the value by calling `y.share.map.get('propertyName')`.

```
y.share.map.set('name', 'value')
y.share.map.get('name') // => 'value'
y.share.map.delete('name')
y.share.map.get('name') // => undefined
```

You can also create new types using the shared map type:

```
// create a new Y.Map
var newMap = y.share.map.set('mymap', Y.Map)
newMap.set('deep value', 'string')
})
```

#### Observe Changes
Every type has its own bunch of events that you can listen to. A y-map can throw *add*, *update*, and *delete* events.

```
var map = y.share.map

// Set an observer
map.observe(function(event){
  console.dir(event)
})

// create a new property (add)
map.set('number', 7) // => { type: 'add', name: 'number', value: 7, oldValue: undefined }
// update an existing property (update)
map.set('number', 8) // => { type: 'update', name: 'number', value: 8, oldValue: 7 }
// delete a property
map.delete('number') // => { type: 'delete', name: 'number', oldValue: 8 }
```


## Y.Array

Y.Array is great for sharing linear data.

### Insert / Delete Elements

Create a new Y.Array, and apply changes to it:
```
var array = y.share.map.set('array', Y.Array)

// insert four elements at position 0
array.insert(0, [1,2,3,4])
// retrieve an element
console.log(array.get(1)) // => 2
// retrieve the Y.Array values as an array
console.log(array.toArray()) // => [1, 2, 3, 4]

```

#### Observe Changes
Y.Array throws *insert*, and *delete* events.

```
var map = y.share.map

// Set an observer
map.observe(function(event){
  console.dir(event)
})

// insert 3 values at position 2
map.insert(2, [1,2,3]) // => { type: 'insert', index: 2, values: [1, 2, 3] }
// delete the first two values starting from index 2
map.delete(2, 2) // => { type: 'delete', index: 2, oldValues: [1, 2] }

// insert a type at position 0
map.insert(0, Y.Text) // => { type: 'insert', index: 0, values: [ text ] } (text is a Y.Text)

```

## Explore the modules.

Visit the github repositories of the modules - they contain more examples, and documentation.

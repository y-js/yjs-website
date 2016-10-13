
This is your getting started guide for Yjs. In this tutorial we create a shared Yjs instance, and introduce the very powerful [y-map](https://github.com/y-js/y-map) and [y-array](https://github.com/y-js/y-array) types. Please feel encouraged to try out everything you find here in your browser console.
If you have any questions, drop us a line via [gitter](https://gitter.im/y-js/yjs).

Yjs only knows how to resolve conflicts on shared data. Before we start we need to describe our set-up. We have to choose a ..
* *Connector* - a communication protocol that propagates changes to the clients 
* *Database* - a database to store your changes
* one or more *Types* - that represent the shared data

In this tutorial we choose Websockets as the communication protocol, and an in-memory database for storing the shared data. Here is our set-up:

| Connector | Database | Types |
| --------- | -------- | ----- |
| [y-websockets-client](https://github.com/y-js/y-websockets-client) | [y-memory](https://github.com/y-js/y-memory) | [y-map](https://github.com/y-js/y-map), [y-array](https://github.com/y-js/y-array) |

There are various other options to communicate, and persist changes. Check out the [modules section](/modules) in order to find out about all the options you have!

##### Table of Contents

* [Install and Include Dependencies](#!/tutorial)
  * [Bower](#!/tutorial)
  * [NPM](#!/tutorial)
* [Create a Yjs Instance](#!/tutorial)
* [Shared Types](#!/tutorial)
  * [Y.Map Type](#!/tutorial)
    * [Update / Delete Properties](#!/tutorial)
    * [Observe Changes](#!/tutorial)
  * [Y.Array Type](#!/tutorial)
    * [Insert / Delete Elements](#!/tutorial)
    * [Observe Changes](#!/tutorial)


### Install and Include Dependencies

##### Bower
Here is how you could use Yjs in the browser using [Bower](https://bower.io) as a package manager:

```
bower install --save yjs y-webrtc y-memory y-map y-array
```

You only need to include the `yjs` module. Yjs is able to automatically require missing modules (browser only).

```HTML
<script src="./bower_components/yjs/y.js"></script>
```

##### NPM
Here is how you could use Yjs in a Node.js app:

```bash
npm install --save yjs y-webrtc y-memory y-map y-array
```

If you don't include `yjs` with a script tag, you have to explicitly include all modules!

```javascript
var Y = require('yjs')
require('y-memory')(Y) // extend Y with the memory module
require('y-websockets-client')(Y)
require('y-array')(Y)
require('y-map')(Y)
// ..
// do the same for all modules you want to use
```

### Create a Yjs instance
At this point we installed all the modules, and included them in our project. We create a Yjs instance by calling `Y(options)`. This returns a [Promise](https://www.promisejs.org/), which is resolved when the connector initialized a connection.

```javascript
Y({
  db: {
    name: 'memory' // store the shared data in memory
  },
  connector: {
    name: 'websockets-client', // use the websockets connector
    room: 'my room'            // Instances connected to the same room share data
    // url: 'localhost:1234' // specify your own server destination
  },
  share: { // specify the shared content
    map: 'Map',    // y.share.map is of type Y.Map
    array: 'Array' // y.share.array is of type Y.Array
  },
  sourceDir: '/bower_components' // where the modules are (browser only)
}).then(function (y) {
  /* 
    At this point Yjs is successfully initialized.
    Try it out in your browser console!
  */
  window.y = y
  console.log('Yjs instance ready!')
  y.share.map // is an Y.Map instance
  y.share.array // is an Y.Array instance
})
```

If you don't specify `options.connector.url`, it connects to one of the servers we provide.
The server instance maintains rooms, in which clients can share data. Visit [y-websockets-server](https://github.com/y-js/y-websockets-server) in order to find out how to set up your own server.

Finally, `y.share.*` holds the shared data. We specify two shared types (Y.Map, and Y.Array) that we use in this tutorial. The pattern is fairly simple. If you specify `share: { NAME: 'TYPE'} `, then `y.share.NAME` is a Y.TYPE (where TYPE is a valid type).  

### Shared Types
In the Yjs project, we strongly distinguish between *data type* and *data structure*.
Yjs knows how to handle concurrency on several data structures like Maps, Trees, Lists, and Graphs.
Shared types have an API, and are build upon the data structures that Yjs supports. Since Yjs supports all the basic data structures, it is possible to create a shared type for virtually any kind of data.

#### Y.Map Type

[Y.Map](https://github.com/y-js/y-map) maps from strings to arbitrary values. Just make sure, that it is possible to convert the value to a string (using 'JSON.stringify').

##### Update / Delete Properties

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

##### Observe Changes

Every type has its own set of events that you can listen to. A Y.Map can throw *add*, *update*, and *delete* events.

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


#### Y.Array Type

[Y.Array](https://github.com/y-js/y-array) for a detailed description of all methods.) is great for sharing linear data.


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

You can also create new types using the shared map type:

```
// create a new Y.Array
y.share.array.insert(0, [Y.Map])
var newMap = y.share.array.get(0)
newMap.set('deep value', 'string')
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
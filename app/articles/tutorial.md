

In this tutorial we will introduce the basics of Yjs, and we will showcase how to create a collaborative text area. We will use the websockets protocol to share changes, and we will use an in-memory database to persist the data. But note: there are various other options to communicate, and persist changes. Check out the [modules section](/modules) in order to find out about all the options you have!

Furthermore, you are encouraged to try out everything you find here in your browser console.
In every distribution of Yjs you'll find an `./Examples` directory that includes some simple projects.
If you have any questions drop us a line via [gitter](https://gitter.im/y-js/yjs).

### Prerequisites
Yjs expects that you have a Promise/A+ implementation on the window/global object. Though this has been [specified in ECMASrcipt 2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) not all browser implement it yet. You can include any Promise/A+ compatible implementation. If you don't know which one to include, check out the [es6-promise polyfill](https://github.com/jakearchibald/es6-promise).

Yjs is tested on nodejs >= `0.10`. But in order to use it you have to enable harmony support for nodejs < `4.0.0` like this:
```
node --harmony ./yourApp.js
# or in order to start a gulp task
node --harmony $(which gulp)
```

All thats left to do is:
* Download Yjs, and the modules you want to use via bower, npm, or zip
  * In this tutorial we will use the `y-memory`, `y-websockets-client`, `y-array`, `y-map`, and `y-text` modules
  * For testing you can use the default connection point for `y-websockets-client`. For productive systems I recommend to set up your own installation(see [here](https://github.com/y-js/y-websockets-server)).
* Include Yjs in your app via (E.g. via `<script>` tag)

##### Include with bower
```
npm install -g bower
bower install yjs y-memory y-websockets-client y-array y-map y-text
```

##### Include with npm
```
npm install yjs y-memory y-websockets-client y-array y-map y-text
```

### Create a shared Yjs instance
You initialize the shared object by calling `Y(options)`. This will return a promise, which is resolved when the following conditions are met:
* All modules are loaded:
  * The specified database adapter is loaded
  * The specified connector is loaded
  * All types are included
* The connector is initialized, and a unique user id is set

```
Y({
  db: {
    name: 'memory' // store the shared data in memory
  },
  connector: {
    name: 'websockets-client', // use the websockets connector
    room: 'my room'
    // url: 'localhost:2345'
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

Yjs dynamically includes all required modules from the `sourceDir`.
If you don't specify a `options.connector.url`, it connects to one of the servers we provide.
The server instance maintains rooms, in which clients can share data (see [y-websockets-server](https://github.com/y-js/y-websockets-server)).
Finally, `y.share` holds the shared data. We specified three shared types (Y.Text, Y.Map, and Y.Array) that we use during this tutorial.

# Yjs types
In the Yjs project, we strongly distinguish between *data type* and *data structure*.
Yjs knows how to handle concurrency on several data structures like Hash-Maps, Trees, Lists and Graphs.
You can create arbitrary data types with these types. In the [modules section](/modules)
we list a bunch of types that you can use in your project, and we show how to create your own types.

### Y.Map type
Lets manipulate some of the properties of the `y.share.map` type.
Call `y.share.map.set("propertyName", 42)` in order to set a primitive value on your shared y-map type.
The change will be available to all clients in the same room. You can retrieve the value by calling `y.share.map.get("propertyName")`.

```
y.share.map.set("name", "value")
y.share.map.get("name") // => "value"
y.share.map.delete("name")
y.share.map.get("name") // => undefined
```

You can set arbitrary values on a y-map. Just make sure, that it is possible to convert it to a string (e.g. with 'JSON.stringify'). You can create a new y-map like this:

```
// create a new Y.Map type and wait until it is created
y.share.map.set("mymap", Y.Map).then(function (map) {
  // at this point the new map property is created
  map.set("deep value", "string")
})
```

Note that `y.share.map.get('map')` returns a promise, if a type is stored under the "map" property name. So you have to wait for it to be initialized:
```
y.share.map.get("mymap").then(function (map) {
  // manipulate map
})
```

#### Observe Changes
Every type has its own bunch of events that you can listen to. A y-map can throw *add*, *update*, and *delete* events.

```
y.share.map.observe(function(events){
  for(i in events){
    console.log("The following event-type was thrown: "+events[i].type)
    console.log("The event was executed on: "+events[i].name)
    console.log("The event object has more information:")
    console.log(events[i])
  }
})
```

## Y.Array

You can manage arrays with this type.

### Insert / Delete Elements

Create a new y-list, and apply changes to it:
```
y.share.map.set("list", Y.List).then(function (list) {
  // insert four elements at position 0
  list.insert(0, [1,2,3,4])
  // retrieve an element
  console.log(list.get(1)) // => 2
  // retrieve the list as an array
  console.log(list.getArray()) // => [1,2,3,4]
})

```
Y.List throws *insert* and *delete* events. Set an observer on the `list` and repeat the previous example.

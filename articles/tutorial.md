

In this tutorial we will introduce the basics of Yjs, and we will showcase how to create a collaborative text area. We will use the websockets protocol to share changes, and we will use an in-memory database to persist the data. But note: there are various other options to communicate, and persist changes. Check out the [modules section](/modules) in order to find out about all the options you have!

Furthermore, you are encouraged to try out everything you find here in your browser console. Try to tinker with some of the examples. If you have any problems drop a question via [gitter](https://gitter.im/y-js/yjs).

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
  * In this tutorial we will only use the `y-memory`, `y-websocket-client`, `y-array`, and `y-text` modules
* Include Yjs in your app via (E.g. via `<script>` tag)

### Create a shared Yjs object
You initialize the shared object by calling `Y(options)`. `Y(options)` will return a promise, which is resolved when the following conditions are met:
* All modules are loaded
  * The specified database adapter is loaded
  * The specified connector is loaded
  * All types are included
* The connector is initialized, and a unique user id is set

Please include the following code in your browser console. The `yconfig` object
should be immediately available on the `window` object.

```
Y({
  db: {
    name: 'memory'
  },
  connector: {
    name: 'websockets-client',
    room: 'my room'
  },
  types: ['Array', 'Text'],
  sourceDir: '/bower_components'
}).then(function (yconfig) {
  // yconfig holds all the information about the shared object
  window.yconfig = yconfig
  // yconfig.root holds the shared element
  window.y = yconfig.root
})
```

`y` is of type [y-map](/modules/y-map) - very similar to Javascripts' [Map type](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map).
You can also use it to store other shareable types which makes it very useful to structure your data.

# Yjs types
In the Yjs project, we strongly distinguish between *data type* and *data structure*. Yjs knows how to handle concurrency on several data structures like Maps, Trees, Lists and Graphs. You can create arbitrary data types with these types. In the [wiki](https://github.com/y-js/yjs/wiki) we list a bunch of types that you can use in your project, and we show how to create your own types.

### Y.Map type
Lets manipulate some of the properties of the `y` object.
Call `y.set("propertyName", 42)` in order to set a primitive value on your shared y-map type.
The change will be available to all clients in the same room. You can retrieve the value by calling `y.get("propertyName")`.

```
y.set("name", "value")
y.get("name") // => "value"
y.delete("name")
y.get("name") // => undefined
```

You can set arbitrary values on a y-map. Just make sure, that it is possible to convert it to a string (e.g. with 'JSON.stringify'). You can create a new y-map like this:

```
// create a new Y.Map type and wait until it is created
y.set("mymap", Y.Map).then(function (map) {
  // at this point the new map property is created
  map.set("deep value", "string")
})
```

Note that `y.get('map')` returns a promise, if a type is stored under the "map" property name. So you have to wait for it to be initialized:
```
y.get("mymap").then(function (map) {
  // manipulate map
})
```

#### Observe Changes
Every type has its own bunch of events that you can listen to. A y-map can throw *add*, *update*, and *delete* events.

```
y.observe(function(events){
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
y.val("list", new Y.List).then(function (list) {
  // insert four elements at position 0
  list.insert(0, [1,2,3,4])
  // retrieve an element
  console.log(list.get(1)) // => 2
  // retrieve the list as an array
  console.log(list.getArray()) // => [1,2,3,4]
})

```
Y.List throws *insert* and *delete* events. Set an observer on the `list` and repeat the previous example.

## Collaborative Text Area
We use the [y-text](https://github.com/y-js/y-text) type to create a collaborative textarea. It provides some convenient helpers, e.g. for binding it to any input element. Try the following in your browser console.

```
// create a y-text instance
y.set("text", Y.Text).then(function (text) {
  text.bind(document.querySelector("#textarea"))
})
```

Now, the `text` is bound to the `textarea`. This means that the `text` is updated, when you type something in the `textarea`, and the `textarea` is updated when something is inserted into the `text` type. This is also known as *two way binding*.

<textarea id="textarea" style="width: 100%;height:5em"> Please bind me :)</textarea>

## Handling concurrency

In many cases two clients may create the same type at the same time. For example, two browsers could start with the following code:

```
// create a shared Y.Text type
y.set("textarea", Y.Text).then(function (text) {
  text.bind(document.querySelector("#textarea"))
})
```

Of course, only one shared Y.Text type can exist under the same property name. Therefore, one of the Y.Text types is overwritten, and the binding to the textarea is deleted. So we have to make sure to listen to changes on the y object, and bind the "textarea" property to the textfield every time it is overwritten:

```
y.observe(function(events) {
  for(var i = 0; i < events.length; i++) {
    var event = events[i]
    if(event.name === "textarea" &&
       event.type !== "delete")
    {
      y.get("textarea").then(function (text) {
        text.bind(document.querySelector("#textarea"))
      })
    }
  }
})
```

You could also use `observePath` to bind the textarea whenever the property changes:
```
yconfig.root.observePath(['text'], function (text) {
  if (text != null) {
    text.bind(document.querySelector("#textarea"))
  }
})
```

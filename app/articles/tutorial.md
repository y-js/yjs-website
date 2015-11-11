

This tutorial will give you a good idea on how you can work with Yjs. For detailed instructions on the components that are described here, check the respective repositories. You find a list of all the Yjs modules, and more information about Yjs in the [github wiki](https://github.com/y-js/yjs/wiki).

Furthermore, you are encouraged to try out everything you find here in your browser console. Try to tinker with some of the examples. If you have any problems, ask a question in the comments section at the bottom of this page.

### Prerequisites
Yjs expects that you have a Promise/A+ implementation on the window/global object. Though this has been [specified in ECMASrcipt 2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) not all browser support it yet. If you don't know which Promise implementation to include, check out the [es6-promise polyfill](https://github.com/jakearchibald/es6-promise).

Yjs is tested on nodejs >= `0.10`. But in order to use it you have to enable harmony support for nodejs < `4.0.0` like this:
```
node --harmony ./yourApp.js
// or
node --harmony $(which gulp)
```

### Create a shared Yjs object


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

### Connectors
First of all, you have to define how you want your peers to connect to each other. Therefore, we introduce the concept of *connectors*. The connector is the interface that defines how your clients communicate with each other. The cool thing in Yjs is, that you can simply interchange different connectors. Therefore, you can switch from the XMPP connector to the WebRTC connector by changing only a few lines of code. In this tutorial we will use the Websockets connector. But you should check out the WebRTC connector too - it is really fast!

#####  Tips:

* Try to pick a random room name, so that it does not collide with another users room name. E.g. "efkdyjd0" - you can generate random room names like this: `(Math.random()+1).toString(36).substring(10)`
* You get the *ids* of all connected users with `connector.connections`. (works only *after* you bound the connector to an instance of Y)

### Create a shared document
Now, you can create your shared document, which is an instance of Y (because it is created with the *new* operator). All the changes on the instance of Y will be instantly propagated to the other peers.

{% highlight html %}
<script src="./yjs/y.js"></script>
<script>
  var y = new Y(connector);
</script>
{% endhighlight %}

'y' will inherit all the functionality of the *Y.Object* class. So the following section will apply to it.

## Y.Object
In the Yjs project, we strongly distinguish between *data type* and *data structure*. Yjs knows how to handle concurrency on several data structures like HashMaps, Trees, Lists and Graphs. You can create arbitrary complex data types with them. In the [wiki](https://github.com/y-js/yjs/wiki) we list a bunch of types that you can include in your project, and we show you how to create your own types.

The y-object types is the only type that is included in Yjs. It represents a Javascript object, where you can *add*, *update*, and *delete* object-properties. You can even create circular structures, if you want.

##### Set, and Delete Properties

Add, or update property "name" with value "42":

{% highlight javascript %}
// set a property
y.val("name",42)
// retrieve a property
console.log(y.val("name")) // => 42
// retrieve all properties of y
console.log(y.val()) // => {name: 42}
{% endhighlight %}

You can set arbitrary objects on a y-object. Just make sure, that it is possible to convert them to a string (e.g. with 'JSON.stringify'). You can create a new Y.Object like this:

{% highlight javascript %}
y.val("myobj", new Y.Object({some_initial_content: "hi there"}))
console.log(y.val("myobj").val()) // => {some_initial_content: "hi there", new: "string"}
{% endhighlight %}

Delete the "name" property.

{% highlight javascript %}
y.delete("name")
{% endhighlight %}

##### Observe Changes
Every type has its own bunch of events that you can listen to. All y-objects can throw *add*, *update*, and *delete* events. The observe pattern in Yjs is very similar to [Object.observe](http://www.html5rocks.com/en/tutorials/es7/observe/?redirect_from_locale=de), an upcoming standard for observing changes on Javascript objects.

{% highlight javascript %}
y.observe(function(events){
  for(i in events){
    console.log("The following event-type was thrown: "+events[i].type)
    console.log("The event was executed on: "+events[i].name)
    console.log("The event object has more information:")
    console.log(events[i])
  }
})
{% endhighlight %}


##### Tips:
* Use *tab+enter* to enter the previous code into your browser console
* Sometimes you want your client to wait, until it is synchronized with all the other clients. Just call `connector.whenSynced(function(){console.log("synchronized")})`
* Read the documentation of the y-object type on the [github repository](https://github.com/y-js/yjs#yobject)

## Y.List

You can manage lists with this type. In order to use this type you have to include the y-list library. Learn more about this type [here](https://github.com/y-js/y-list).

##### Insert / Delete Elements

Create a new Y.List:
{% highlight javascript %}
y.val("list", new Y.List([1,2,3]))
{% endhighlight %}

and apply changes to it
{% highlight javascript %}
var list = y.val("list");
// insert 4 at position 3
list.insert(3,4)
// retrieve an element
console.log(list.val(3)) // => 4
// retrieve the list as an array
console.log(list.val()) // => [1,2,3,4]
{% endhighlight %}

Y.List throws *insert* and *delete* events. Set an observer on the `list` and repeat the previous example.

## Collaborative Text Area
In order to create a collaborative textarea, you can use the [y-text](https://github.com/y-js/y-text) type. It has some convenient helpers, e.g. for binding it to an arbitrary input element. Try the following in your browser console.

{% highlight javascript %}
// create a y-text instance
y.val("text", new Y.Text("content"));

// get the Word-Type
var text = y.val("text");

// get a textarea dom object
var textarea = document.querySelector("textarea");

// bind the mutable string to the textarea
text.bind(textarea)

console.log(text.val()) // => "content" - retrieve the current value

{% endhighlight %}

Now, the `text` is bound to the `textarea`. This means that the `text` is updated, when you type something in the `textarea`, and the `textarea` is updated when something is inserted into the `text`. This is also known as *two way binding*.

<textarea style="width: 100%;height:5em"> Please bind me :)</textarea>

### Handling concurrency

In many cases two clients may create the same type at the same time. For example, two browsers could start with the following code:

{% highlight javascript %}
// create a shared Y.Text type
y.val("textfield", new Y.Text("My initial Text"));
// bind the created Y.Text type to a text area
y.val("textfield").bind(textarea)
{% endhighlight %}

Of course, only one shared Y.Text type can exist under the same property name. Therefore, one of the Y.Text types is overwritten, and the binding to the textarea is deleted. So we have to make sure to listen to changes on the y object, and bind the "textfield" property to the textfield every time it is overwritten:

{% highlight javascript %}
y.observe(function(events) {
  for(var i = 0; i <events.length; i++) {
    var event = events[i];
    if(event.name === "textfield" && event.type !== "delete") {
      y.val("textfield").bind(textfield);
    }
  }
});
{% endhighlight %}

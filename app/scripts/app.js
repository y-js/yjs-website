/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.moduleDescriptionWebrtc = "With the WebRTC connector all users exchange changes directly with each other. While WebRTC is not the most reliable connector, messages are propagated with almost no delay.\n\
\n\
* Very fast message propagation (not noticeable)\n\
* Very easy to use\n\
* Very little server load (you still have to set up a [signaling server](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/))\n\
* Not suited for a large amount of collaborators\n\
* WebRTC is not supported in all browsers, and some have troubles communicating with each other\n\
* Works only in the browser"

  app.moduleDescriptionWebsockets = "With the websockets connector you can set up a central server that saves changes and communicates with clients.\n\
This option is very similar to other shared editing frameworks that require a central server.\n\
Because the websocket connector is build on top of [socket.io](socket.io), this connector is a rock solid choice\n\
if you require high reliability.\n\
\n\
* Extremely reliable\n\
* Very easy to use\n\
* Some server load\n\
* You can set up a central server that persists changes\n\
* Falls back to http-communication, if websockets are not supported\n\
* Work with nodejs and in the browser"

  app.moduleDescriptionXmpp = "XMPP is a well known federated protocol to exchange data. This is definitely an interesting choice if you require high scalability.\n\
\n\
* Can act as a Connector for a scaling number of users\n\
* Sophisticated Rights Management\n\
* Federated\n\
* Works with nodejs and in the browser"

  app.moduleDescriptionIndexeddb = "Use the IndexedDB database adapter to store your shared data\n\
persistently in the browser. The next time you join the session,\n\
your changes will still be there.\n\
\n\
* Minimizes the amount of data exchanged between server and client\n\
* Makes offline editing possible\n\
* Not supported by all browsers"

  app.moduleDescriptionMemory = "Use the Memory database adapter to store your shared data\n\
efficiently in-memory. The next time you join the session,\n\
your changes will be lost\n\
\n\
* Supported by all browsers"

  app.moduleDescriptionMap = "Use the Y.Map type to map key-value pairs.\n\
```\n\
// Create a new Y.Map type\n\
y.share.map.set('new map type', Y.Map).then(function (map) {\n\
  // Observe the map type\n\
  map.observePath(['my value'], function (value) {\n\
    console.log(\"You created a new value:\", value)\n\
  })\n\
  // Now we create a new property\n\
  map.set('my value', 42) // => \"You created a new value: 42\"\n\
  // And retrieve the value\n\
  map.get('my value') // => 42\n\
})\n\
```"

  app.moduleDescriptionArray = "Use the Y.Array type to handle shared lists of data.\n\
```\n\
// Observe the array type\n\
y.share.array.observe(function (events) {\n\
  for (var i = 0; i < events.length; i++) {\n\
    console.log(\"New event: \", events[i])\n\
  }\n\
})\n\
y.share.array.insert(0, [1])\n\
  // => \"New event: {type: \"Insert\", position: 0, value: 1}\"\n\
y.share.array.delete(0, 1)\n\
  // => \"New event: {type: \"Delete\", position: 0, length: 1}\"\n\
```"

  app.moduleDescriptionText = "Use the Y.Text type to share text content, and bind it to\n\
arbitrary input elements (E.g. input, textarea, or any element that has the *contenteditable* property)\n\
```\n\
// bind text to the first p element that is contenteditable\n\
y.share.text.bind(document.querySelector(\"p[contenteditable]\"))\n\
```"

  app.moduleDescriptionRichtext = "Use the Y.RichText type to share rich text, and bind it to\n\
  the [quill editor](http://quilljs.com/).\n\
\n\
**NOTE:** This type is currently migrating and not available in yjs@1.0.*\n\
```\n\
// bind richtext to an instance of quill\n\
y.share.richtext.bind(document.querySelector(\"quill\"))\n\
```"

  app.moduleDescriptionSelections = "Use the Y.Selections type to share selections on Y.Array types.\n\
\n\
**NOTE:** This type is currently migrating and not available in yjs@1.0.*\n\
```\n\
// choose an array on which you want to select something\n\
var array = y.share.array\n\
// select the first two elements and assign \"bold\" to them\n\
// (You can assign any string to a selection)\n\
y.share.selections.select(array, 0, 1, [\"bold\"])\n\
```"

  app.moduleDescriptionXml = "Use the Y.Xml type to share XML content, and bind it to\n\
the the browser DOM to observe the real-time changes\n\
\n\
**NOTE:** This type is currently migrating and not available in yjs@1.0.*\n\
```\n\
// create a DOM double binding\n\
var shared_dom = y.share.xml.getDOM()\n\
// and append it to the body\n\
document.body.append(shared_dom)\n\
```"

  function createBlogpostDefinition (date, name) {
    return {
      date: date,
      url: '/article/' + name + '.md',
      title: name
    }
  }

  app.blogposts = [
    createBlogpostDefinition("19 November 2015", "Yjs Release 0.6"),
    createBlogpostDefinition("13 May 2015", "Yjs Release 0.5"),
    createBlogpostDefinition("10 February 2015", "Yjs Release 0.4")
  ]

  app.blogpostUrlToName = function blogpostUrlToName (url) {
    url = url.split('/')
    return url[url.length - 1].slice(0, -3)
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!document.querySelector('platinum-sw-cache').disabled) {
      document.querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
    var t = document.getElementById('mainToolbar')
    if (app._isMobile) {
      t.classList.remove('tall')
    } else {
      t.classList.add('tall')
    }
    var textareascript = document.createElement('script')
    var jigsawscript = document.createElement('script')
    textareascript.src = './bower_components/yjs/Examples/Textarea/index.js'
    jigsawscript.src = './bower_components/yjs/Examples/Jigsaw/index.js'
    document.head.appendChild(textareascript)
    document.head.appendChild(jigsawscript)
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainContainer').scrollTop = 0;
  };


  app.getMainMode = function (isMobile) {
    return isMobile ? 'scroll' : 'cover'
  }

  app.properties._isMobile = {
    type: String,
    notify: true,
    observer: 'setMainToolbarClass'
  }

  app.setMainToolbarClass = function (isMobile) {
    var tb = document.getElementById('mainToolbar')
    if (tb == null) {
      app.initialToolbarClass = isMobile ? '' : 'tall'
      return
    }

    if (isMobile) {
      tb.classList.remove('tall')
    } else {
      tb.classList.add('tall')
    }
  }

  app.topologyTotal = {
    "nodes":[
      {"name":"Client 1","group":1},
      {"name":"Client 2","group":2},
      {"name":"Client 3","group":3},
      {"name":"Client 4","group":4},
      {"name":"Client 5","group":5},
      {"name":"Client 6","group":6}
    ],
    "links":[
      {"source":0,"target":0},
      {"source":0,"target":1},
      {"source":0,"target":2},
      {"source":0,"target":3},
      {"source":0,"target":4},
      {"source":0,"target":5},

      {"source":1,"target":1},
      {"source":1,"target":2},
      {"source":1,"target":3},
      {"source":1,"target":4},
      {"source":1,"target":5},

      {"source":2,"target":2},
      {"source":2,"target":3},
      {"source":2,"target":4},
      {"source":2,"target":5},

      {"source":3,"target":3},
      {"source":3,"target":4},
      {"source":3,"target":5},

      {"source":4,"target":4},
      {"source":4,"target":5}
    ]
  }
  app.topologyStar = {
    "nodes":[
      {"name":"Server","group":1},
      {"name":"Client 1","group":0},
      {"name":"Client 2","group":0},
      {"name":"Client 3","group":0},
      {"name":"Client 4","group":0},
      {"name":"Client 5","group":0},
      {"name":"Client 6","group":0}
    ],
    "links":[
      {"source":0,"target":1},
      {"source":0,"target":2},
      {"source":0,"target":3},
      {"source":0,"target":4},
      {"source":0,"target":5},
      {"source":0,"target":6}
    ]
  }

  app.topologyFederated = {
    "nodes":[
      {"name":"XMPP Server","group":1}, // 0
      {"name":"XMPP Server","group":2}, // 1
      {"name":"XMPP Server","group":3}, // 2
      {"name":"Client","group":0}, // 3
      {"name":"Client","group":0}, // 4
      {"name":"Client","group":0}, // 5
      {"name":"Client","group":0}, // 6
      {"name":"Client","group":0}, // 7
      {"name":"Client","group":0}  // 8
    ],
    "links":[
      {"source":0,"target":3},
      {"source":0,"target":4},
      {"source":1,"target":5},
      {"source":2,"target":6},
      {"source":2,"target":7},
      {"source":2,"target":8},

      {"source":0,"target":1},
      {"source":0,"target":2},
      {"source":1,"target":2}
    ]
  }

})(document);

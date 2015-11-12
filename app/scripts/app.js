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

  function createBlogpostDefinition (date, name) {
    return {
      date: date,
      url: '/article/' + name + '.md',
      title: name
    }
  }

  app.blogposts = [
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

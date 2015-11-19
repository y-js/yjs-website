In the last few month I was working on the next release of Yjs which supports permanent storage of the shared data type - therefore enabling offline editing. It turned out to be a complete rewrite of the 0.5 version. I figured that the most elegant solution would be to work directly on the database, when changing shared types. But this requires my database accesses to be asynchronous, but the 0.5 version assumes that the database accesses are synchronous (changing the data doesn't require a callback).

The first solution would be to implement this with callbacks. But since my code requires a lot of database accesses, this solution would lead to a big implementational overhead, and probably unreadable code (“callback hell”). Promises (or similar async libraries) are a great solution, and would solve this problem very elegantly. But these libraries are always implemented "salgo-free" - meaning that callbacks are put in the event loop. One requirement was to implement a database adapter with IndexedDB (for offline editing with the browser). But IndexedDB, requires that transactions are never delayed, so you must not put callbacks in the event loop. Therefore, I wasn't even able to use Promises. The current implementation of Yjs heavily relies on generators, a new functionality that was introduced in EcmaScript2015 (ES6, Harmony, or whatever it is called now..). I found a way to exploit the generators to solve my problem very elegantly. You can compare the following three methods for handling IndexedDB three get requests.

**Callbacks**
```
getDataById(id, function (result1) {
  getDataById(result1.id, function (result2) {
    getDataById(result2.id, function (result3) {
      // in this function the third result is available
    })
  })
})
```

**Promises**
```
getDataById(id).then(function(result1){
  return getDataById(result1.id)
}).then(function (result2) {
  return getDataById(result2.id)
}).then(function (result3) {
  // in this function the third result is available
})
```

**Generators**
```
requestDBTransaction(function * () {
  var result1 = yield getDataById(id)
  // the execution is continuod when result1 is available..
  var result2 = yield getDataById(result1.id)
  // the execution is continuod when result2 is available..
  var result3 = yield getDataById(result2.id)
  // here, the third result is available
})
```

In order to write your own database adapter, all you have to do is write a generator definition for transactions on your database. This makes a database definition very minimalistic, and precise. In the coming weeks I’ll update the github wiki on how to write custom database adapters.

Yjs requires that database adapters do support some kind of transaction with single write access (a single user has exclusive write access). In the future I plan to support concurrent transactions too, for some computations on the shared type.

### In-Memory Database adapter

In Yjs 0.5 I stored operations in a javascript Object (I used it for key-value mapping). The EcmaScript spec does not specify how to implement Object’s key-value mapping - but all major browsers implement it with some kind of hashing algorithm. But the used hash implementations are not designed to work on big sets of data. E.g. with a growing (or decreasing) number of objects in the key-value store, the store has to be recreated all over again, which caused user interface freezes for a short duration. In general I would argue that Hashing is not a good choice for growing/decreasing datasets. This is why I created a Red Black Tree implementation just for storing operations. The performance increase for storing huge amounts of data is huge compared to Javascripts native Object - now I am able to map millions of objects without user interface freezes. Furthermore I observed that memory is freed much faster by the browsers garbage collector. Another advantage of binary trees over hashtables is that you can efficiently query through a range of the stored data. This is an very important feature when syncing two clients. In the old version, I had to query over all the data, just for sending a small amount of missing operations.

Concluding the following improvements for in-memory operation storage:
* speed
* no user interface freezes
* querying over ranges of data
* faster garbage collect
* deleting objects is very fast

### IndexedDB database adapter
This is one of the key features of this new release. When you use the IndexedDB adapter, the content of the shared data is still available when you re-open the browser - ultimately enabling you to create feature rich offline applications like e.g. an offline email application, or offline rich text editing. Furthermore, the other clients don’t have to send the complete shared content, if you already participated in the session.

When a user opens two browser tabs that share the same shared data type, both tabs will use the same IndexedDB database. This led to problems, because IndexedDB does not support any kind of events - therefore there is no way to notify clients that a client applied an operation on the shared database object. But I was able to solve this problem by communicating over localStorage. All in all I would argue that this is a very nice solution when thinking about performance: Every operation is applied and transformed against concurrently created operations only once. Furthermore, I could apply the same pattern to let several nodejs server instances share a single redis database for storing shared data (in that case i would communicate over redis publish-subscribe) - In my opinion this is an interesting topic for future work..

# Connector
The definition for a custom connector hasn't changed much. But I had to adapt the sync algorithm, and the garbage collection algorithm, because of the new late join (re-joining the session with new content) functionality.

### Garbage collection
When doing garbage collection in Yjs 0.5, I faced several problems that I described in my thesis. The new late sync functionality yields unexpected problems. When removing an operation from the database In Yjs 0.5, I changed the origin of all operations that originate in the deleted operation to the left operation of the origin. But with late sync enabled, the left operation of the origin is not unique, which can lead to inconsistencies. I haven’t yet found a solution for this problem - but I bypass this problem with a special syncing method which requires that offline users must not garbage collect. While this did not conform to my expectations, I found this to be satisfying for now.

### Syncing
When two clients exchange missing operations, you have to reset the ‘left’, ‘right’, and ‘origin’ of every insertion to a known operation, so that it is applicable. In the old version I had a rather simple approach. But I found out that, with late sync enabled, setting the origin leads to inconsistencies. This is why I had to find a way so that I can send all missing operations without changing the origin.

# Types
When I started the implementation of the new shared type definition, I started a query if the community would be fine if the types only supported asynchronous behavior (changing a type results in a change when the database query finishes). But there are some kind of applications, where you would prefer synchronous behavior. One of the challenges of the type definition is how to provide an synchronous interface, with an asynchronous endback. The irony: this is conflict resolution all over again, because operations that are created by the synchronous interface could conflict with the operations received by the asynchronous endback. To continue the irony, I solved this with an adapted Operational Transformation algorithm. But the result is very satisfying.

While the definition of connectors almost did not change, the new custom types definition changed a lot, and this is why I took the chance to provide more goodies for custom types.
For example, ..
* They can depend on each other
* They can inherit functionality from each other
* Errors are thrown automatically, when the user provides invalid input (still, type definitions should validate the user input)
* You can keep relevant data in memory, if you want - or not! For example, the shared list type also supports synchronous behavior - therefore you have to keep all the objects in the list in memory (duplicated from the database). Shared types are not automatically loaded into memory (only on request) - this reduces the amount of memory used when working on big structures. In the future I plan to use WeakMaps to detect which loaded types are actually used by the user, and free the memory if the user does not actually use the shared type. But I can’t use them now because the support for WeakMaps is unstable, and there is no working polyfill.

# New Build features
* re-written in ES2015
* compiles to ES5, if necessary
* compiles to several module types (brocolli, npm, requirejs..)
* compiles very fast with gulp
* Rewrote the testing suite using jasmine. I included the old tests, and created some more random tests.
* [https://github.com/feross/standard|standard] javascript linting (maybe we should use this at the chair? its awesome..)
* automatic deployment

# Future work:

* Update the documentation, and howtos
* Implement Socket.IO connector (because it is very easy)
* Implement NoSQL database adapter (for nodejs)
* Create more examples that show the new capabilities of Yjs 1.0
* Implement a structure for shared selections (see y-selections)
* Implement the rich text type
* Find a better way to include Yjs modules
* Re-implement XMPP connector

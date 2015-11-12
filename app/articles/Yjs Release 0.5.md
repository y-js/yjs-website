Many things have been improved since the last release. Most noteworthy is the support for custom types. I put a lot of effort into making it very easy for regular developers to implement their own types. They should not be required to understand all the internals of the algorithm, so I abstracted it by separating between structures, and types. You can read more about it, in the newly created [github wiki for Yjs](https://github.com/y-js/yjs/wiki). Furthermore, I improved the website, updated the tutorial to the new types, and rewrote all the types of the 0.4 release as custom types (all in all we have six different types now). I refactored most of the codebase, and there were several issues, that were created by users of Yjs, that needed attendance. I formed a partnership between [Veeting](http://veeting.com) & [Linagora](http://linagora.org), and with the help of Corentin Cadiou, we created a new rich text type, that can be bound to the [QuillJs](http://quilljs.com) editor. The Quill developers were really helpful, and fixed our issues almost immediately. A live demo of the prototype can be seen under [y-js.org/y-richtext](http://y-js.org/y-richtext).

It is also noteworthy to mention that I created a new structure in Yjs (I called it composition structure), that would enable any OT algorithm to work P2P. The composition stucture can force OT operations to get executed in a unique order for every user. This could solve the so called TP2 problem (which is still an unsolved problem in the OT world). I propose to use OT in some applications, because there are applications where OT is a better choice than Yjs (because Yjs will always need more memory space than OT). Furthermore, this is a nice research result. In the future I would like to prove my statement by implementing support for the widely used [ot-types](https://github.com/ottypes).

## Future Plans

### Plans for the 0.6 Release
* Store operations in a database
* The database is abstracted, so you can use IndexedDB (in the browser) or redis (on the server)
* Offline editing & rejoin

### Todo
* What is the best choice to store operations with nodejs.
* We could use redis, or mongodb, .. proposals?
* Find libraries for databases
* Should work client and server side

### Plans for the 0.7 Release
* Undo
* ... per textfield, per object, per type, per Yjs instance, ..
* ... without breaking consistency of a data type
* ... how can we use it in custom data types?
* ... when offline
* ... infinite undo
* ... is contradictory with Garbage Collection. Find a way to solve this

### Plans for the 1.0 Release and above
* Switch to [semver](http://semver.org/)
* More ways to ensure consistency in custom data types.
* Can be achieved by combining operations to a semantically consistent entity
* Make sure that the size of the messages is minimized as much as possible
* Write Yjs for other languages as well

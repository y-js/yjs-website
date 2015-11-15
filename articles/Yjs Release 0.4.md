
Previously I had to rename the Framework from Yatta to Yjs. I got a call from a very friendly company, and found out that Yatta is actually trademarked in Europe. The idea to name the framework Yatta originated in the name I used for the transformation approach. I named it *Yet Another Transformation Approach* (YATA), because there are sooo.. many alternative algorithms out there for the same thing, and I felt kinda bad to come up with another one. In my bachelor thesis I used the word "YATA" to explain insertions and deletions on text. When you insert a "T" at the fourth position, you end up with the word _Yatta_. And when I googled for it, this was the first thing that popped to my eye:

<div align="center">
<iframe width="420" height="315" src="https://www.youtube.com/embed/kL5DDSglM_s" frameborder="0" allowfullscreen></iframe>
</div>
It turned out that Yatta is japanese for "I did it!". It really seemed to be a neat name for the project..

In the source code I often prefixed variables that belong to the framework with an "Y" - e.g. YString, and YArray for classes and yMemeList for instanziated classes. This can really help you to distinguish shared types and ordinary types. [Petru](http://dbis.rwth-aachen.de/cms/staff/nicolaescu) had the idea that Y can represent the merging of two branches (automatic conflict resolution). This is also represented in our logo:

<div align="center">
<img style="height:5em;width:auto" src="/images/yjs.png" />
</div>

Besides from renaming the Framework, I also created an abstract connector definition that handles the sync process. The initial problem was that creating a new connector type is quite difficult: You have to know how operations are applied in the Yjs framework, and you have to come up with an efficient way to synchronize a user with the other users at the beginning of a session. Therefore, I came up with the following sync-models:

### SyncAll Sync Method
This sync method originates from the original WebRTC connector. Everyone synchronizes with each other: Right after the connection is created, the peers exchange a state vector, and then send all the remaining Operations to the other users. After that, the connector only has to make sure that all sent operations reach all the other peers. I got feedback that this is the prefferred method to use, because there is no set-up involved. This method is totally fine and efficient for small networks, but is not well suited for a lot of users.

### Master-Slave Sync Method
Here, we have one or several *master* clients online that serve as the endpoint for the syncing process of the *slaves*. Therefore, you only have to sync once, even if there are thousands of users online. Still, operations can be published p2p (they don't have to go through the master-client). But you have to make sure that the master client(s) have a high uptime. They should not leave the session while a user syncs with it.

I'm going to write an article on how you can write your own connector.

# Future Plans
These are some notes of what I plan to do in the next releases.

### Plans for the 0.5 Release
* Enable you to build custom data types without inspecting the Yjs code
* Further reduce the size of the messages that are sent
* Re-enabling XML as a custom data type

### Plans for the 0.6 Release
* Enable you to store operations in a database
  * The database is abstacted, so you can use IndexedDB (in the browser) or redis (on the server)
* Offline editing

### Plans for the 0.7 Release
* Undo
  * ... per textfield, per object, per type, per Yjs instance, ..
  * ... without breaking consistency of a data type
  * ... how can we use it in custom data types?
  * ... when offline
  * ... infinite undo
  * ... is contradictory with Garbage Collection. Find a way to solve this

### Plans for the 0.8 Release
* More ways to ensure consistency in custom data types.
  * Can be achieved by combining operations to a semantically consistent entity

### Plans for the 1.0 Release
* Make sure that the size of the messages is minimized as much as possible
* Write Yjs for other languages as well

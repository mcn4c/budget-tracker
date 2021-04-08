var request = self.IndexedDB.open('EXAMPLE_DB', 1);
var db;
request.onsuccess = function(event) {
    console.log('[onsuccess]', request.result);
    db = event.target.result; // === request.result
};
request.onerror = function(event) {
    console.log('[onerror]', request.error);
};

request.onupgradeneeded = function(event) {
    // create object store from db or event.target.result
    db.createObjectStore(storeName, options);
};

//options object can have two properties. options.keyPath 

//EXAMPLE
request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var store = db.createObjectStore('products', {keyPath: 'id'});
};


//If you want IndexedDB to generate auto incremented integer keys (1, 2, 3,…) whenever a new object entry is added to the store, then set options.autoIncrement to true.


store.createIndex(indexName, keyPath, options);

//indexName is the name of the index which can be anything, while keyPath is any key on the object which should be used to check for duplicate entries. options is an optional object which contains an extra configuration of an index being created. A unique index is created by using {unique: true} in options object.

//*****************************************

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var store = db.createObjectStore('products', {keyPath: 'id'});
// create ***unique index on keyPath === 'id'
    store.createIndex('products_id_unqiue, 'id', {unique: true});
};

//*****************************************

// to do any ***transactions*** on the database need:

var transaction = db.transaction(storeName, mode);
var transaction = db.transaction(storeNamesArray, mode);

//mode parameter is optional. mode can be either readonly, readwrite, or versionchange. By default, readyonly is the default mode.

//To perform an operation in any store, we need to get the object store from the transaction with the below syntax.

var objectStore = transaction.objectStore(storeName);

//transactions can receive DOM events of three different types: error, abort, and complete

//*****************************************


//objectStore is an instance of IDBObjectStore interface which provides methods like get, add, clear, count, put, ////delete etc.

var request = self.IndexedDB.open('EXAMPLE_DB', 1);
request.onsuccess = function(event) {
    // some sample products data
    var products = [
        {id: 1, name: 'Red Men T-Shirt', price: '$3.99'},
        {id: 2, name: 'Pink Women Shorts', price: '$5.99'},
        {id: 3, name: 'Nike white Shoes', price: '$300'}
    ];
// get database from event
    var db = event.target.result;
// create transaction from database
    var transaction = db.transaction('products', 'readwrite');
// add success event handleer for transaction
    // you should also add onerror, onabort event handlers
    transaction.onsuccess = function(event) {
        console.log('[Transaction] ALL DONE!');
    };
// get store from transaction
    // returns IDBObjectStore instance
    var productsStore = transaction.objectStore('products');
// put products data in productsStore
    products.forEach(function(product){
        var db_op_req = productsStore.add(product); // IDBRequest
    });
};

//Any operations done on object store, like productStore.add will return IDBRequest object, which will trigger events like success and error, for individual database operations. Hence they should be handled by onsucess and onerror event handler like below.

var db_op_req = productsStore.add(product);
db_op_req.onsuccess = function(event) {
    console.log(event.target.result == product.id); // true
};
db_op_req.onerror = function(event) {
    // handle error
};



objectStore.add(data)
This creates new object in object store from provided data.
objectStore.get(key)
Returns an object with specified key.
objectStore.getAll()
Returns all objects in the store. You can also pass optional parameter, read here https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll
objectStore.count(key?)
Returns the total number of objects that match the provided key or IDBKeyRange. If no arguments are provided, it returns the total number of objects in the store.
objectStore.getAllKeys()
Returns keys of all objects present in the store. You can also pass optional parameter, read here https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAllKeys
objectStore.put(data, key?)
This updates existing objects in an object store when the transaction’s mode is readwrite. key is not needed when keyPath is provided in object store. If object with key doesn’t exist, then it will create new object from data.
objectStore.delete(key)
Deletes the object with provided key.
objectStore.clear()
Deletes all objects in object store.  

//SEE BELOW FOR FULL CRUD------>>>

var request = self.indexedDB.open('EXAMPLE_DB', 1);

request.onsuccess = function(event) {
    // some sample products data
    var products = [
        {id: 1, name: 'Red Men T-Shirt', price: '$3.99'},
        {id: 2, name: 'Pink Women Shorts', price: '$5.99'},
        {id: 3, name: 'Nike white Shoes', price: '$300'}
    ];

    // get database from event
    var db = event.target.result;

    // create transaction from database
    var transaction = db.transaction('products', 'readwrite');

    // add success event handleer for transaction
    // you should also add onerror, onabort event handlers
    transaction.onsuccess = function(event) {
        console.log('[Transaction] ALL DONE!');
    };

    // get store from transaction
    var productsStore = transaction.objectStore('products');

    /*************************************/

    // put products data in productsStore
    products.forEach(function(product){
        var db_op_req = productsStore.add(product);

        db_op_req.onsuccess = function(event) {
            console.log(event.target.result == product.id); // true
        }
    });

    // count number of objects in store
    productsStore.count().onsuccess = function(event) {
        console.log('[Transaction - COUNT] number of products in store', event.target.result);
    };

    // get product with id 1
    productsStore.get(1).onsuccess = function(event) {
        console.log('[Transaction - GET] product with id 1', event.target.result);
    };

    // update product with id 1
    products[0].name = 'Blue Men T-shirt';
    productsStore.put(products[0]).onsuccess = function(event) {
        console.log('[Transaction - PUT] product with id 1', event.target.result);
    };

    // delete product with id 2
    productsStore.delete(2).onsuccess = function(event) {
        console.log('[Transaction - DELETE] deleted with id 2');
    };
};

request.onerror = function(event) {
    console.log('[onerror]', request.error);
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var productsStore = db.createObjectStore('products', {keyPath: 'id'});
};

//*****************************************
//*****************************************

These are the basic steps you should follow to make your application available offline.
Cache static files in install event handler of service worker.
In activate event handler of service, remove old cached files. This also makes a good place to initialize IndexedDB database, better than using the service worker’s install event handler, since the old service worker will still be in control at that point, and there could be conflicts if a new database is mixed with an old service worker. Create IndexedDB database with proper version and using fetch API (to pull data from web service) to add entries to the database for offline use. Use keyPath as URL endpoint that you would like to use for offline access. Make sure these URLs falls under service worker’s scope. Example of such URL will be /offline-api/users.
Whether online or offline, your app will use cached files. But API requests for data will still propagate to the network because you commonly will be using separate origin for data, like https://api.example.com/users.
In your main program, when you make request for data like https://api.example.com/users which returns in 404 error or some other error because of bad internet connection, retry the request with modified URL like https://example.com/offline-api/users. This will go through service worker.
Inside service worker’s fetch event handler, if a request starts with /offline-api, then fetch data from database with key equal to the path of the request. Set proper header on the response like application/json and return response back to the browser. You can use Response constructor for that.

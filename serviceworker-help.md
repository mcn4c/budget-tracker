// Event listener for retrieving data
self.addEventListener('fetch', function(event) {
    event.respondWith(
	// Get the request from the cache, then return it
        caches.match(event.request))
	.then(function(response) {
	    return response;
	});
    );
});

//Inside of our install callback, we need to take the following steps:

Open a cache.
Cache our files.
Confirm whether all the required assets are cached or not.

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


//GET Request This allows for a faster load for static content. Code for serving a resource from the cache might look like this:

// Event listener for retrieving data
self.addEventListener('fetch', function(event) {
    event.respondWith(
	// Get the request from the cache, then return it
        caches.match(event.request))
	.then(function(response) {
	    return response;
	});
    );
});


//Storing the resource in the cache will allow it to be served more quickly the next time it’s requested. We can expand on our previous code sample to show this.

// Event listener for retrieving data
self.addEventListener('fetch', function(event) {
    var req = event.request.clone();
    if (req.clone().method == "GET") {
        event.respondWith(  
         
	    // Get the response from the network
	    return fetch(req.clone()).then(function(response) {
	       // And store it in the cache for later
		return cache.put(req.clone(), response);
	    });	
        );
    }
});

//we actually respond to the event, we check to see if the request method is “GET.” We do that because right now, you can’t store POSTs with the Cache API. 


//Next, you need to store the POST data in local storage so it can be sent to the server later. To do that, we extend on our message event listener.

navigator.serviceWorker.addEventListener('message', function(event) {
    alert(event.data.alert);
    store();
});

//The store function gets the values the user inputted and saves them in a string called “newPost” in local storage. You could also use IndexedDB.

//The string is called “newPost” to simplify the code — if your app supports multiple new POST requests, then you would want to give each POST a unique identifier in local storage or IndexedDB. 

function store() {
    var newPost = ""; // Inputted values
    // Iterate through the inputs
    $("input").each(function() {
        newPost += $(this).val() + ",";
    });
    // Get rid of the last comma
    newPost = newPost.substr(0, newPost.length - 1);
    // Store the data
    localStorage.setItem('newPost', newPost);
}

//Now that you’ve saved your POST data, you just need to submit it once the user goes back online. You can do this by appending inputs to a hidden form in the page’s HTML and then submitting the form.

//Here’s what the hidden form might look like:

// Empty form for voting for your favorite article

<form method="post" action="/vote" id="offlinePostForm"></form>

//And here’s how you might append the inputs to the form.

// Call the function whenever the page is refreshed

$(function () {
    if (localStorage.getItem('newPost')) {
	// Set keys and values for voting for your favorite article	var names = ['first', 'last', 'article'];
        var values = localStorage.getItem('newPost').split(',');
	// Form to append inputs to
	var form = $("#offlinePostForm"); 
	// Create and append inputs
	for (var i = 0; i < names.length; i++) {
	    var input = '<input type="hidden" name="' 
		+ names[i] + '" value="' 
		+ values[i] + '">';
	    $(input).appendTo(form);
	}
	// Clear newPost from localStorage and submit the form
	localStorage.removeItem('newPost');
	form.submit();
    }
});

//Service Workers are a virtual proxy between the browser and the network. They finally fix issues that front-end developers have struggled with for years — most notably how to properly cache the assets of a website and make them available when the user’s device is offline.
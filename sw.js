const weatherlyApp = "WeatherLy-4.0";
const dynamicWeatherlyApp = "dynamic-WeatherLy-1.0"; // for dynamic caching of resources not pre cached
const assets = [
  "/",
  "index.html",
  "assets/css/style.css",
  "assets/js/script.js",
  "assets/img/ic.png",
  "assets/img/ic512.png",
  "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600&display=swap",
  "https://fonts.gstatic.com/s/chakrapetch/v4/cIf6MapbsEk7TDLdtEz1BwkWkKpgar3I1D8t.woff2",
  "https://fonts.gstatic.com/s/chakrapetch/v4/cIf6MapbsEk7TDLdtEz1BwkWn6pgar3I1A.woff2",
  "https://fonts.gstatic.com/s/chakrapetch/v4/cIflMapbsEk7TDLdtEz1BwkeQI51R5_F_gUk0w.woff2",
  "https://fonts.gstatic.com/s/chakrapetch/v4/cIflMapbsEk7TDLdtEz1BwkebIl1R5_F_gUk0w.woff2",
  "manifest.json",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size)); // keeps calling itself until the if condition is no longer true
      }
    });
  });
};

// install service worker
self.addEventListener("install", (installEvent) => {
  // Self is the service worker itself which enables us to listen to lifecycle events
  //console.log('service worker has been installed');
  installEvent.waitUntil(
    //lets the installEvent function wait until the caching is done
    caches.open(weatherlyApp).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets); // pre-caching
    })
  );
});

// activate event
self.addEventListener("activate", (activateEvent) => {
  //console.log('service worker has been activated');
  activateEvent.waitUntil(
    caches.keys().then((keys) => {
      console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== weatherlyApp && key !== dynamicWeatherlyApp)
          .map((key) => caches.delete(key)) //deletes old caches
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", (fetchEvent) => {
  //console.log('fetch event', fetchEvent);

  // check if request is made by chrome extensions or web page
  // if request is made for web page url must contains http.
  if (!(fetchEvent.request.url.indexOf("http") === 0)) return; // skip the request. if request is not made with http protocol
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((cachesRes) => {
      return (
        cachesRes ||
        fetch(fetchEvent.request).then((fetchRes) => {
          //returns cached resource if available else carries on with the fetch
          return caches.open(dynamicWeatherlyApp).then((cache) => {
            // for inserting in dynamic cache
            cache.put(fetchEvent.request.url, fetchRes.clone());
            limitCacheSize(dynamicWeatherlyApp, 5); //limits the number of items in the cache
            return fetchRes;
          });
        })
      );
    })
  );
});

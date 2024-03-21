var db;
var requestDB = indexedDB.open('myDB', 1);


requestDB.onerror = function(event) {
  // Handle errors
  console.log("Error");
};

requestDB.onsuccess = function(event) {
  console.log("Success");
  db = event.target.result;
};

requestDB.onupgradeneeded = function (event) {
  console.log("Upgraded");
  db = event.target.result;
  db.createObjectStore("store", { keyPath: "id" });
};
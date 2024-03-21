var db;
var requestDB = indexedDB.open('myDB', 3);


requestDB.onerror = function(event) {
  // Handle errors
};


requestDB.onsuccess = function(event) {
  db = event.target.result;
  console.log(db);
  // Perform operations on the database
};
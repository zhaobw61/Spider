'use strict';
var stringify = require('csv-stringify');
var fs = require('fs');

let myObj =  [
    [
      "New Visitor123",
      "(not set)",
      "(not set)",
      "0"
    ]
  ]

stringify(myObj, function(err, output) {
  fs.appendFile('name.csv', output, 'utf8', function(err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else {
      console.log('It\'s saved!');
    }
  });
});

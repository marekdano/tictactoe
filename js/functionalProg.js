var arr = ["one", "two", "three"];

var newArray = arr.map();

[1,2,3,4,5,6,7,8,9,10].filter(function(e) { return e > 7; });

["one", "", true, false, 0, "three"].filter(function(e) { return e === false;});

var arr = [3, 4, 5];
arr.map(function(x) { return x * x;});

var arr = [1,2,3,4,5,6,7,8,9,10];
arr.filter(function(x) { return x % 2 === 0; });

var sum = arr.reduce(function(a, x) { console.log(a, x);
							return a + x;  });
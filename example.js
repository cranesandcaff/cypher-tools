var tools = require("cypher-tools");

var object = {
  movies: "horror"
}

console.log(tools.objToString(object));
console.log(tools.objToParams("object", object));
console.log(tools.labelsToString(["Movie", "Horror"]));

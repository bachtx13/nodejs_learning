"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
console.log(1000);
var app = express();
console.log(10);
app.listen(3000, function () {
    console.log("[server]: Server is running at http://localhost:".concat(3000));
});

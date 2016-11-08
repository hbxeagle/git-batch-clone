"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clone = require("./core/clone.js");

Object.keys(_clone).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _clone[key];
    }
  });
});
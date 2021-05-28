"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPmap = exports.compOP = exports.OP = exports.keywords = void 0;
exports.keywords = ["vars", "skip", "seq", "set", "print", "iif", "while"];
exports.OP = ["+", "-", "*", "div", "mod", "divi"];
exports.compOP = [">", "<", ">=", "<=", "="];
exports.OPmap = {
    "+": "+",
    "-": "-",
    "div": "/",
    "mod": "%",
    "divi": "divi"
};

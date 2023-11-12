// String 'endsWith' polyfill
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (typeof browseris !== 'undefined') {
    browseris.ie = false;
}
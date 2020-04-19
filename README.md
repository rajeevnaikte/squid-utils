# squid-utils
Utility functions:
- BaseError - error object to hold error code and message.
- nonNull(object, errorObjectSupplier?)<br/>
Throws NullObjectError if null or undefined. Optionally custom 'errorObjectSupplier' can be passed to be thrown.
- toNumOrStr(object)<br/>
Given any object, return number if it is, otherwise return toString() value.
- keys(mapOrObject)<br/>
Given map or an object return keys in an array.
- values(mapOrObject)<br/>
Given map or an object return values in an array.
- includesI(collection, searchString)<br/>
Search the string in the collection ignoring case.
- getOrSetDefault(map, key, defaultValue)<br/>
Get value of key in the map. If not pathExists, then set the default value in the map for the key and then return the default value.
- getOrCall(map, key, callbackFn)<br/>
Get map value for the key. If not pathExists then call the function. and return its value if any.

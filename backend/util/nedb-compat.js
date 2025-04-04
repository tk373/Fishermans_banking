/**
 * NeDB Compatibility Layer
 * 
 * This file provides compatibility functions for NeDB to work with the latest Node.js versions
 * where util.isDate and util.isArray have been deprecated.
 */

// Import the original util module
import util from 'util';

// Create a compatibility layer for util.isDate
if (typeof util.isDate !== 'function') {
  // Add the isDate function to the util module
  util.isDate = function(obj) {
    return obj instanceof Date;
  };
}

// Create a compatibility layer for util.isArray
if (typeof util.isArray !== 'function') {
  // Add the isArray function to the util module
  util.isArray = function(obj) {
    return Array.isArray(obj);
  };
}

export { util }; 
// Node helper module for projects using this npm package
// Returns paths for Sass and Templates

// Node module imports
const path = require('path');

// Function returns absolute system path to location for a path that is passed
//  relative to the location of this file.
const absPath = function (relativePath) {
    return path.join(__dirname, relativePath);
}

module.exports = {
    templates: absPath('web/templates/twig-source')
};

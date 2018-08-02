const util = require('util');
const fs = require("fs");
const nodePandoc = require('node-pandoc');

//const readFile = util.promisify(fs.readFile);

const sourceFilePath = "tmp/";
const destFilePath = "output/";


// should work in any browser without browserify

if (typeof Promise.prototype.done !== 'function') {
    Promise.prototype.done = function (onFulfilled, onRejected) {
        const self = arguments.length ? this.then.apply(this, arguments) : this;
        self.then(null, function (err) {
            setTimeout(function () {
                throw err;
            }, 0);
        });
    };
}

/**
 * This will batch process a folder of files
 * @param filepath -
 */
function processFiles(filepath){
    console.log("files in process :: ", filepath);
    return new Promise(function (fulfill, reject){
        return readFile( filepath ).done(function (res){
            try {
                fulfill( res );
            } catch( ex ) {
                reject( ex );
            }
        }, reject);
    });
}

/**
 * @param filename - path to a single file
 * @param enc Unused
 */
function readFile(filename){
    return new Promise(function (fulfill, reject){
        // console.log("Pandoc :: " + filename);
        nodePandoc( filename, '-f docx -t html5', function (err, result) {
            if (err) {
                reject( err );
            }
            fulfill( result );
        });
    });
}

function convertText ( text ) {
    // console.log( text.length );
    nodePandoc( text, '-f docx -t html5', function (err, result) {
        if (err) {
            console.error('Pandoc Error: ', err);
        }
        return result;
    });
}

module.exports = function( filepath ){
    return processFiles(filepath);
};

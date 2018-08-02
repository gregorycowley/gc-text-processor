const fs = require("fs");
const util = require('util');
const findInFiles = require('find-in-files');

const readline = require('readline');
const stream = require('stream');

const readFile = util.promisify(fs.readFile);
const path = "/Users/gcowley/Sites/RocketLawyer.com/RL-CMS-Data/templates/";


/*
    input line of text and an obj with possible matches
    colon delimited key:value
    find matching element in an obj
    return the new content
    if not found return the existing content
*/

function applyOutput ( slug, newTextObj){
    findTemplateFile( slug )
        .then( (res) => parseFile( Object.keys(res)[0], newTextObj) )
        .catch( (res) => console.log("Error ::", res ) );

}


function findTemplateFile( slug ) {
    return new Promise ( function (resolve, reject) {
        findInFiles.find(slug, path)
            .then(function(results) {
                resolve( results );
            });
    });
}

function parseFile ( path, newTextObj ){
    const instream = fs.createReadStream( path );
    const outstream = new stream;
    const rl = readline.createInterface(instream, outstream);
    let outputString = "";
    let fileName = "temp.txt";

    rl.on('line', function(line) {
        let splt = line.split(":");
        if ( splt[0].trim() === "templates_uuid") fileName = splt[1].trim().replace(/"/g, "");
        let newLine = [splt[0].trim(), (newTextObj[splt[0].trim()] || splt[1])].join(":") + "\n";
        outputString += newLine;
    });

    rl.on('close', function() {
        // console.log("We're done.", outputString);
        fs.writeFile(fileName, outputString, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });

    // readFile( path, "utf8" ).then(
    //     (res) => console.log(res)
    // ).catch(
    //     (err) => console.log(err)
    // );
}


function applyContent( textline, matchingObj) {
    const keyA = textline.split(":")[0].trim();
    return matchingObj.hasOwnProperty(keyA) ? matchingObj[keyA] : "";
}

function convertToYaml( textObj ) {

}

function convertToObject( yamlText ) {
    let obj = {};
    const elements = yamlText.split("\n");
    for ( let line of elements ){
        const keyValue = line.split(":");
        //obj[] =
    }
}

// function Match (line of text, )
// todo: refactor this for perfomance
function findMatch (objA, objB){

}

function findContentByKey( searchKey, obj ){
    let content = "";
    //const keys = Object.keys(obj);
    for (let i = 1; i <= Object.keys(obj).length; i++) {
        if ( Object.keys(obj)[i] === searchKey){
            content = obj[i];
        }
    }
    return content;
}

module.exports = {
    output: applyOutput
};

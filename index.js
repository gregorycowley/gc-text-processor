const fs = require("fs");
const path = require('path');
const files = require("./lib/files.js");
const fmt = require("./lib/formatting.js");
const apply = require("./lib/apply.js");
const cleanup = require("./lib/cleanup.js");
const convert = require("./lib/convert.js");
const os = require('os');
const args = require('minimist')(process.argv.slice(2));
const cmsDataPath = os.homedir() + 'Sites/RocketLawyer.com/RL-CMS-Data';

let templatesMap = {};

console.log( "Running :: ", args );
// Running :: /Users/gcowley/.nvm/versions/node/v8.10.0/bin/node,/Users/gcowley/Sites/RocketLawyer.com/RL-Utils/TextProcessing/index.js,verify

if ( process.argv[2] === "verify" ){
    console.log ( "verifying text files" );
    readTemplates();
} else if ( process.argv[2] === "convert" ){
    console.log ( "converting text files" );
} else if ( process.argv[2] === "cms" ){
    console.log ( "symlinking cms :: " + process.argv[3].split("=")[1] );
    fs.symlink( args["cms"] , './cms-data', function ( err ) {
        if (err) throw err;
        console.log( "created symlink" );
    });
} else if ( process.argv[2] === "format" ){
    console.log ( "formatting text files" );
    init("tmp");
} else if ( process.argv[2] === "cleanup" ){
    console.log ( "cleaning up" );
} else {
    console.log ( "no recognizable command supplied" );
}


function init(filePath) {
    files(filePath).then(
        (result) => processResult(result)
    ).catch(
        (reason) => console.log("File Error :: ", reason)
    );
}

function processResult( text ){
    let obj = objectifyText(text);
    let cleanObj = iterateObject(obj);
    apply.output( "college-education-trust", cleanObj);
}

function objectifyText ( text ) {
    let eleArray = text.match(/((Meta Title:)|(Meta Description:)|(Description:)|(Body:)|(List:)|(Summary:))/gi);
    if ( eleArray.length < 6 ) console.log( "There might be a problem with the Google Doc formatting" );
    // Manual Build of object todo: this can be improved
    let output = {
        title2: text.match(/Title:([\s\S]*)(Meta|New) Title:/i)[1] || "",
        slug: text.match(/Slug:([\s\S]*)Title:/i)[1] || "",
        display_name: text.match(/(Meta|New) Title:([\s\S]*)(Meta|New) Description:/i)[1] || "",
        meta_description:  text.match(/(Meta|New) Description:([\s\S]*)Description:/i)[0] || "",
        description:  text.match(/Description:([\s\S]*)List:/i)[1] || "",
        reasons_to_create_text:  text.match(/List:([\s\S]*)Summary:/i)[1] || "",
        summary:  text.match(/Summary:([\s\S]*)/i)[1] || ""
    };
    return output;
}

function iterateObject ( obj ){
    newObj = {};
    newObj.title = format ( obj.title, "no-html html-entities no-returns no-ids no-classes" );
    newObj.slug = format ( obj.slug, "no-html html-entities no-returns no-ids no-classes" );
    newObj.display_name = format ( obj.display_name, "no-html no-returns  no-ids no-classes" );
    newObj.meta_description = format ( obj.meta_description, "no-html no-returns no-ids no-classes" );
    newObj.description = format ( obj.description, "no-html" );
    newObj.reasons_to_create_text = format ( obj.reasons_to_create_text, "make-list" );
    newObj.summary = format ( obj.summary, "no-returns no-ids no-classes no-encoded-html pad-h2s" );
    return newObj;
}

function format(text, formats) {
    if (!formats || text === undefined) return;
    let newText = text;
    const operations = formats.split(" ");
    for (let formatting of operations) {
        switch (formatting) {
            case "no-html":
                newText = fmt.removeTags(newText).trim();
                break;
            case "html-entities":
                newText = fmt.htmlEntities(newText).trim();
                break;
            case "make-list":
                newText = fmt.ulList(newText).trim();
                console.log( newText );
                break;
            case "no-returns":
                newText = fmt.removeReturns(newText).trim();
                break;
            case "no-ids":
                newText = fmt.removeIdAttributes(newText).trim();
                break;
            case "no-classes":
                newText = fmt.removeClassAttributes(newText).trim();
                break;
            case "no-encoded-html":
                newText = fmt.removeEncodedHtml(newText).trim();
                break;
            case "pad-h2s":
                newText = fmt.padTag(newText, "h2");
            default:
        }
    }
    newText = fmt.escapeChars(newText);
    newText = fmt.escapeStraitQuotes(newText);
    newText = fmt.wrapWithQuotes(newText);

    return newText;
}

function readTemplates() {
    console.log('Setting up templates');
    var templatesPath = path.join("cms-data", 'templates');
    fs.readdir(templatesPath, function(err, files) {
        Promise.all(files.map(function(file) {
            return new Promise(function(resolve) {
                fs.readFile(path.join(templatesPath, file), {encoding: 'utf8'}, function(err, data) {
                    resolve({url: getSlug(data), id: file})
                });
            })
        })).then(function(values) {
            values.forEach(function(value) {
                templatesMap[value.url] = value.id;
            });
            console.log("Templates ::", templatesMap);
            //setupPaths();
        });
    });
}

function getSlug(data) {
    var start = data.indexOf('url_slug: "') + 11;
    return data.substring(start, data.indexOf('"', start));
}
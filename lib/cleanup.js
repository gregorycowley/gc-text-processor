var fs = require("fs");


function cleanup( text ){

}

function identifyLabels(text){

    return [];
}

function straitenQuotes(){

}

function smartenQuotes(){

}

function htmlEntities (){
    //Cleanup:
    // * HTML Entities (ASCII Chars about 127)
    // * Apostrophes to single quotes
    // * Quotations to strait quotes (double and single)
}

function processFormatting(){
    // * Bold to <strong>
    // * Italic to <i>
    // * Headings to <h> tags
    // * Indents to <blockquotes>
}

function linksToText (){

}

function makeLists (){

}

function wrapUp (){
    // * One <br> before <h2> and one <br> after.
    // * Remove empty tags
    // * Add <p> tags
    // * Remove returns
    // * Tabs to spaces
    // * Remove double spaces
}



// ﻿## Text Processing
// * Read in .docx files and use pandoc to convert them to plain text with formatting(Markdown, LaTex, RTF)
// * Globally:
// * Identify Labels
// * Cleanup:
// * HTML Entities (ASCII Chars about 127)
// * Apostrophes to single quotes
// * Quotations to strait quotes (double and single)
// * Formatting:
//     * Confirm plain text
// * Bold to <strong>
// * Italic to <i>
// * Headings to <h> tags
// * Indents to <blockquotes>
// * Convert:
// * Links to text (escape quotations)
// * Lists to HTML
// * Misc:
// * One <br> before <h2> and one <br> after.
// * Remove empty tags
// * Add <p> tags
// * Remove returns
// * Tabs to spaces
// * Remove double spaces


module.exports = function( text ){
    return cleanup(text);
};

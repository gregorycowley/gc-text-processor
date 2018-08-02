
// const he = require('he');


function _removeTags( text ) {
    return text.replace(/<[^>]*>/gi, "");
}

function _htmlEntities( text ) {
    return text;
}

const charTable = [
    ["Guillemets", "&laquo;", "&#171;", "&#171;", "0xab"],
    ["Guillemets", "&raquo;", "&#187;", "&#187;" ,"0xbb"],
    ["Middle dot", "&middot;", "&#183;", "&#183;" ,"0xb7"],
    ["En dash", "&ndash;", "&#8211;", "&#8211;" ,"0x2013"],
    ["Em (long) dash", "&mdash;", "&#8212;", "&#8212;" ,"0x2014"],
    ["Single quotes", "&lsquo;", "&#8216;", "&#8216;" ,"0x2018"],
    ["Single quotes", "&rsquo;", "&#8217;", "&#8217;" ,"0x2019"],
    ["Single low quote", "&sbquo;", "&#8218;", "&#8218;" ,"0x201a"],
    ["Double quotes", "&ldquo;", "&#8220;", "&#8220;" ,"0x201c"],
    ["Double quotes", "&rdquo;", "&#8221;", "&#8221;" ,"0x201d"],
    ["Double low quote", "&bdquo;", "&#8222;", "&#8222;" ,"0x201e"],
    ["Bullet", "&bull;", "&#8226;", "&#8226;" ,"0x2022"],
    ["Prime & double prime", "&prime;", "&#8242;", "&#8242;" ,"0x2032"],
    ["Prime & double prime", "&Prime;", "&#8243;", "&#8243;" ,"0x2033"]
];

function _straitenQuotes( text ) {
    let newText = text.replace(/(\u2019|\u2018)/gi, "\x22" );
    return newText.replace(/(\u201c|\u201d)/gi, "\x27");
}

function _escapeStraitQuotes ( text ) {
    let newText = text;
    // Double Quotes:
    newText = newText.replace(/\\([\s\S])|(")/gi,  "\\$1$2");
    // Single Quotes
    newText = newText.replace(/\\([\s\S])|(')/gi, "\\$1$2");
    return newText;
}

function _escapeSmartQuotes ( text ) {
    let newText = text;
    // Single Quotes:
    newText = newText.replace(/(\u2018)/gi, "&lsquo;" );
    newText = newText.replace(/(\u2019)/gi, "&rsquo;" );
    // Double Quotes
    newText = newText.replace(/(\u201c)/gi, "&ldquo;" );
    newText = newText.replace(/(\u201d)/gi, "&rdquo;" );
    return newText;
}

function _wrapWithQuotes( text ){
    return newText = text.replace(/(^(?!")|[^"]$)/gm, "\"");
}

function _removeReturns( text ) {
    return text.replace(/(\r|\n|\r\n)/gi, "");
}

function _removeIdAttributes( text ) {
    return text.replace(/ id=".*?"/gi, "");
}

function _removeClassAttributes( text ) {
    return text.replace(/ class=".*?"/gi, "");
}

function _escapeQuotationMarks( text ) {
    return text.replace(/"/g, '\\"');
}

function _makeLinksRelative( text ) {
    return text.replace(/https?:\/\/www.*?\.rocketlawyer\.com/g, '');
}

function _removeEncodedHtml( text ){
    return text.replace(/&lt;\/?.*?&gt;/gi, "");
}

function _removeEmptyLines( text ){
    return text.replace(/((^|\n)\s*\n\s*)+/gmi, "\n");
}

function _padTag(text, tag){
    // todo: refactor to use back reference
    const re1 = new RegExp("<" + tag + ">", "gmi");
    const re2 = new RegExp("</"+tag+">", "gmi");
    let padOpeningTag = text.replace( re1, "<br><" + tag + ">");
    let padClosingTag = padOpeningTag.replace( re2, "</" + tag + "><br>");
    return padClosingTag;
}

function _removeTag( text, tag){
    const re = new RegExp("<\/?" + tag + ">", "gmi");
    return text.replace( re, "");
}

function _paragraph( regs ) {
    let line = regs[1];
    let trimmed = line.trim();
    if ( trimmed.match( '/^<\/?(ul|ol|li|h|p|bl)/')) {
        return "\n" + line + "\n";
    }
    return "\n<p>" + trimmed + "</p>\n";
}

function _ulList( text ) {
    let newText  = _removeTag(text, "ul");
    newText =  _removeTag(newText, "li");
    newText = newText.replace(/(\s\s|\t|<\/?p>|<\/?blockquote>)/gi, " ");
    newText = newText.replace(/(^[ \t]+|[ \t]+$)/gm, "");
    newText  = _removeEmptyLines(newText.trim());
    let items = newText.trim().split("\n").join("</li><li>");
    return "<ul><li>" + items.trim() + "</li></ul>";
}

function _olList( regs ) {
    let item = regs[1];
    return  "\n<ol>\n\t<li>" + item.trim() + "</li>\n</ol>";
}

function _blockquote ( regs ) {
    let item = regs[2];
    return  "\n<blockquote>" + item.trim() + "</blockquote>";
}

function _header ( ) {
    let level = arguments[0][1].length;
    return '<h' + level + '>' + arguments[0][2].trim() + '</h' + level + '>';
}

module.exports = {
    removeTags: _removeTags,
    htmlEntities: _htmlEntities,
    removeReturns: _removeReturns,
    removeIdAttributes: _removeIdAttributes,
    removeClassAttributes: _removeClassAttributes,
    escapeQuotationMarks: _escapeQuotationMarks,
    makeLinksRelative: _makeLinksRelative,
    paragraph: _paragraph,
    ulList: _ulList,
    olList: _olList,
    blockquote : _blockquote,
    header : _header,
    removeEncodedHtml: _removeEncodedHtml,
    padTag: _padTag,
    escapeChars: _escapeSmartQuotes,
    escapeStraitQuotes: _escapeStraitQuotes,
    wrapWithQuotes: _wrapWithQuotes
};

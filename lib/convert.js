var fs = require("fs");

function pandoc(){
    nodePandoc(srcPath, '-f docx -t html5', function (err, result) {
        if (err) {
            console.error('Pandoc Error: ', err);
        }

        // Todo: Write formatted JSON ::
        const cleanedText = JSON.stringify( render( result, srcPath ) ) + ',';

        fs.appendFile('output/message.json', cleanedText, 'utf8', (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
        return result;
    });
}


module.exports = function( filepath ){

    return ;
};

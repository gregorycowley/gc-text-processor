

Import Google Docs from browser using curl or wget or even just the browser
Let npm create needed folders
Run everything from grunt

Steps for converting text:

Pull Files from Google Docs in .docx format
    Add them to the src folder (input-files)

    Read files and convert to a more usable format (MarkDown)

    Validate each file:
        Do files exist?
        Are files .docx?
        Are files other formats?
        Do files have zero bytes?
        Do files have spaces in their names?


Currently index.js does it's own form of reading in the data:

    define path
    iterate through each file in the path
    create a promise for loading of each file as utf-8
        when complete:
            get the URL slug and the template ID (filename)
            add to a table (templatesMap)

When ready to parse the data:

    use the Template ID (filename) along with the path to find and load the file
        parse the data in the file
             return an array of objects

             step through every character in the data
             also capture the next character
             filter out double quote, forward slash, and make sure the charater is a string
             add to a value 'stack' (concatenated string)
             if this is a double quote or forward slash or not a string
                is it a number? add it to the value stack
                is this a test character? filter for:
                    colon? the contents of the value stack are a property name
                        grab the stack and store as 'type'
                        clear the stack
                    double quote?
                        'type' property becomes 'string'
                    forward slash?
                        are we escaping \n, \r, \t?
                        store the escape value as 'temp'
                        add 'temp' to the value stack
                    opening brace?
                        add an empty object to 'result'
                        grab the stack and store as 'type'
                        clear the stack
                    closing brace?
                        pull the object from 'result'
                        store it in 'value'
                        set 'type' to object
                    otherwise...
                        if this is a number in string form or a period set 'type' to number.


                    is 'propertyAdded' set and the next char not an open brace?
                        set 'add' as true
                        otherwise
                            add the current 'value' stack to properties array
                            clear the stack
                            set 'propertyAdded' to true
                    is 'add' set to true?
                        if this is a number convert it to float
                        leave strings alone
                        leave objects alone
                        toggle 'value' as a boolean
                        grab the last property from the properties array
                        if this is the first result
                            create a new array in the master results
                        push this property in this array as the key and the 'value' stack as the value.
                        clear the stack
                        set 'propertyAdded' and 'add' to false
                    return the result




# gc-text-processor

const fs = require('fs')
const util = require('util')
const path = require('path')
const R = require('ramda')

const rfile = util.promisify(fs.readFile)

const readFile = async (filepath) => {
    try {
        const file = await rfile(path.normalize(filepath))
        return file.toString('UTF8')
    } catch (error) {
        console.log(error)
    }
}

/**
 * check the string and validate if it is a valid movement expression
 * @param {string} str 
 */
const isValidLine = str => (
    (new RegExp('[0-9]{2}-[0-9]{2}-[0-9]{4};[0-9]{2}-[0-9]{2}-[0-9]{4};[^;]{1,};[^;]{1,};[^;]{1,};[^;]{1,}', 'i'))
        .test(str)
)

/**
 * validate an array and filter only valid lines
 * @param {array} arr 
 */
const validateLine = arr => arr.filter(isValidLine)

/**
 * remove extra white spaces from a string
 * @param {string} str 
 */
const removeExtaWhitespace = str => {
    const rgx = new RegExp('  ')
    str = str.replace(rgx, ' ')

    return rgx.test(str)
     ? removeExtaWhitespace(str)
     : str
}

/**
 * convert a text to an array, split by new lines
 * @param {string} str 
 */
const convertToArray = str => str.split("\r\n")

const strToJSON = str => {
    const [
        dateInitiated,
        dateValue,
        description,
        amount,
        type,
        balance
    ] = str.split(';')

    return {
        dateInitiated,
        dateValue,
        description,
        amount: parseFloat(amount),
        balance: parseFloat(balance)
    }
}

const toJSON = arr => arr.map(strToJSON)

const parser = R.pipe(
    removeExtaWhitespace,
    convertToArray,
    validateLine,
    toJSON
)

const main = async (filepath) => {
    const read = await readFile(filepath)
    return parser(read)
}

module.exports = main
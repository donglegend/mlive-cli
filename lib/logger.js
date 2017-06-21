const chalk = require('chalk')

function formatStr(arg) {
    return [].slice.call(arg).concat([].slice.call(arguments, 1)).join(' ')
}

exports.log = function () {
    console.log(chalk.white(formatStr(arguments)))
}

exports.error = function () {
    console.log(chalk.bold.red(formatStr(arguments)))
    process.exit(1)
}

exports.success = function () {
    console.log(chalk.green(formatStr(arguments)))
}
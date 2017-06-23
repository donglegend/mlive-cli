const async = require('async')
const inquirer = require('inquirer')

module.exports = function (prompts, data, done) {
    async.eachSeries(Object.keys(prompts), function (key, next) {
        prompt(data, key, prompts[key], next)
    }, done)
}

function prompt(data, key, prompt, next) {

    // 过滤掉需要先置条件的问题
    if (prompt.when && !evaluate(prompt.when, data)) {
        return next()
    }

    let promptDefault = prompt.default
    if (typeof prompt.default == 'function') {
        promptDefault = prompt.default.bind(this)(data)
    }
    inquirer.prompt([{
        type: prompt.type,
        name: key,
        message: prompt.message || key,
        default: promptDefault,
        validate: prompt.validate || function () {
            return true
        }
    }]).then(function (answers) {
        if (Array.isArray(answers[key])) {
            data[key] = {}
            answers[key].forEach(function (multiChoiceAnswer) {
                data[key][multiChoiceAnswer] = true
            })
        } else if (typeof answers[key] === 'string') {
            data[key] = answers[key].replace(/"/g, '\\"')
        } else {
            data[key] = answers[key]
        }
        next()
    })
}

function evaluate(p, data) {
    return data[p]
}
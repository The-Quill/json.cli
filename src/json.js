#!/usr/bin/env node

const fs = require('fs')

let args = process.argv.slice(2)

if (args.length < 1){
    console.error('NO FILE PROVIDED')
}
if (!fs.existsSync(args[0])){
  console.error(`FILE NAMED ${args[0]} DOES NOT EXIST`)
}
let file
let json
try {
  let file = fs.readFileSync(args[0])
  try {
    json = JSON.parse(file)
  } catch(err){
    console.error(`FILE NAMED ${args[0]} IS NOT VALID JSON`)
    process.exit(128)
  }
} catch(err){
  console.error(`PROGRAM FAILED WITH ERROR CODE: ${err}`)
  process.exit(128)
}
let result = json
let regex = /([^\\]\.[^.])+/
let selector = args[1] || ""
let selectors = []
let index = -1
let hasMatch = selector.match(regex) !== null
while (true){
  let match = selector.slice(index + 1).match(regex)
  if (!match){
    selectors.push(selector.slice(index + 1))
    break
  }
  let s = match.input.slice(0, match.index + 1)
  selectors.push(s)
  index += s.length + 1
}
if (selectors.length > 0){
  if (selectors[selectors.length - 1].endsWith('.')){
    selectors[selectors.length - 1] = selectors[selectors.length - 1].replace(/\.$/, '')
  }
}
selectors.forEach(_ => result = _ == "" ? result : result[_])
let output = typeof result === "object" ? JSON.stringify(result, null, 2) : result
console.log(`${selector ? `"${selector}" `: ''}${output}`)
import { expect } from 'chai'
import { readdirSync, readFileSync } from 'fs'
import { basename, extname, resolve } from 'path'
import { lintRms, parseRms } from '../lib/index'

const readSampleFile = (name: string) => readFileSync(resolve(__dirname, 'samples', name), 'utf8')
const readSample = (name: string) => ({
  name,
  script: readSampleFile(`${name}.rms`),
  correctErrors: JSON.parse(readSampleFile(`generated/${name}.lint-errors.json`))
})

describe('lintRms', () => {
  readdirSync(resolve(__dirname, 'samples'))
    .filter(str => extname(str) === '.rms')
    .map(filename => readSample(basename(filename, '.rms')))
    .forEach(({ name, script, correctErrors }) => {
      it(`lints example ${name}`, () => {
        const ast = parseRms(script).ast
        const errors = ast ? lintRms(ast) : []
        expect(errors).to.deep.equal(correctErrors)
      })
    })
})
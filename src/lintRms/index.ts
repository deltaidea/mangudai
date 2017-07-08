import { RmsAst } from '../parseRms'
import { TextSpan } from '../tokenHelpers'

const rules: { [x: string]: { check: (ast: RmsAst, options: any) => LintError[] } } = {
  // Possible errors
  noConstantCondition: require('./rules/no-constant-condition'),
  noDupeAttributes: require('./rules/no-dupe-attributes'),
  noDupeCommands: require('./rules/no-dupe-commands'),
  noEmptyElse: require('./rules/no-empty-else'),
  noEmptySections: require('./rules/no-empty-sections'),
  noIncludeDrs: require('./rules/no-include-drs'),

  // Stylistic issues
  eolLast: require('./rules/eol-last')
}

export function lint (ast: RmsAst, options: { [x: string]: any } = {}): LintError[] {
  const errors: LintError[] = []
  Object.entries(rules).forEach(([name, rule]) => errors.push(...rule.check(ast, options[name])))
  return errors
}

export interface LintError extends Error {
  name: 'LintError',
  message: string,
  boundaries: TextSpan
}

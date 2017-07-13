import { LintError } from '../'
import { RmsAst } from '../../parseRms'
import { getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst, mode: 'always' | 'never' = 'always'): LintError[] {
  const lastToken = getLastToken(ast)

  if (lastToken && lastToken.type === 'eol' && lastToken.value.endsWith('\n')) {
    return mode === 'always' ? [] : [{
      name: 'LintError',
      message: 'Newline not allowed at end of file.',
      boundaries: getBoundaries(lastToken)
    }]
  } else {
    return mode === 'never' ? [] : [{
      name: 'LintError',
      message: 'Newline required at end of file but not found.',
      boundaries: {
        start: getBoundaries(lastToken).end,
        end: getBoundaries(lastToken).end
      }
    }]
  }
}
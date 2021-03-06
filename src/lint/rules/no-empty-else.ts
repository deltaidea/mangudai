import { LintError } from '../'
import { Script, IfStatement } from '../../parse'
import { getNodes, getChildNode, getToken, getLastToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  const errors: LintError[] = []
  const ifs = getNodes(ast, 'IfStatement') as IfStatement[]
  ifs.forEach(ifNode => {
    if (ifNode.elseStatements && ifNode.elseStatements.length === 0) {
      errors.push({
        name: 'LintError',
        message: "Empty \'else\'.",
        boundaries: {
          start: getBoundaries(getToken(getChildNode(ifNode, 'Else', true))).start,
          end: getBoundaries(getLastToken(ifNode, undefined, true)).end
        }
      })
    }
  })

  return errors
}

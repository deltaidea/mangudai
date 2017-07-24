import { LintError } from '../'
import { Token, CstNode, Script } from '../../parse'
import { getNodes, getToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: Script): LintError[] {
  const seenIdentifiers: { [x: string]: boolean } = {}
  const redeclared: Token[] = []

  getNodes(ast, 'DeclarationStatement').forEach((node: CstNode) => {
    const nameToken = getToken(node, 'identifier', true)
    if (seenIdentifiers[nameToken.value]) redeclared.push(nameToken)
    else seenIdentifiers[nameToken.value] = true
  })

  return redeclared.map(x => ({
    name: 'LintError',
    message: `Cannot redeclare '${x.value}'.`,
    boundaries: getBoundaries(x)
  } as LintError))
}
import { Token } from 'moo'
import { LintError } from '../'
import { RmsAst, RmsIf, ElseIf, RmsFlagDefinition } from '../../parseRms'
import { getDescendants, getFirstToken } from '../../treeHelpers'
import { getBoundaries } from '../../tokenHelpers'

export function check (ast: RmsAst): LintError[] {
  const conditionallyDefinedFlags: string[] = []
  const unconditionallyDefinedFlags: string[] = []
  const invalidConditionIdentifiers: Token[] = []

  getDescendants(ast, 'IfStatement').forEach((ifNode: RmsIf<any>) => {
    if (ifNode.statements) conditionallyDefinedFlags.push(...ifNode.statements.filter(x => x.type === 'FlagDefinition'))
    if (ifNode.elseStatements) conditionallyDefinedFlags.push(...ifNode.elseStatements.filter(x => x.type === 'FlagDefinition'))
  })

  getDescendants(ast, 'FlagDefinition').forEach(({ flag }: RmsFlagDefinition) => {
    if (!conditionallyDefinedFlags.includes(flag)) unconditionallyDefinedFlags.push(flag)
  })

  const allIfs = [...getDescendants(ast, 'IfStatement'), ...getDescendants(ast, 'ElseIfStatement')]
  allIfs.forEach((ifNode: RmsIf<any> | ElseIf<any>) => {
    if (unconditionallyDefinedFlags.includes(ifNode.condition)) {
      invalidConditionIdentifiers.push(getFirstToken(ifNode, 'Identifier') as Token)
    }
  })

  return invalidConditionIdentifiers.map<LintError>(x => ({
    name: 'LintError',
    message: `Condition '${x.value}' is always true.`,
    boundaries: getBoundaries(x)
  }))
}

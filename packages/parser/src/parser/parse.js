import { TokenType } from 'enums/types'
import { TokenTags } from 'enums/tags'
import { TokenContext } from 'enums/context'
import { TokenKind } from 'enums/kinds'
import { ParseError } from 'enums/errors'
import context from 'parser/context'
import ast from 'parser/node'
import scanner from 'parser/scanner'
import spec from 'parser/specs'

/**
 * Parser
 *
 * Liquid/HTML parser function which constructs and tokenized syntaxes.
 *
 * @param {object} document
 * @this {Parser.Options}
 */
export function parse (document = { ast: [] }) {

  /**
   * @type {number}
   */
  let token = scanner.scan()

  /**
   * @type {any}
   */
  let state

  /**
   * @type {Parser.ASTNode}
   */
  let node

  while (token !== TokenType.EOS) {

    switch (token) {

      // SPACING
      // -----------------------------------------------------------------
      case TokenType.DelimiterOpen:
        if (this.context) context.add(TokenContext.OpenTag)
        break
      case TokenType.DelimiterClose:
        if (this.context) context.add(TokenContext.CloseTag)
        break

      // SPACING
      // -----------------------------------------------------------------
      case TokenType.Whitespace:
        if (this.context && this.whitespace) context.add(TokenContext.Whitespace)
        break
      case TokenType.Newline:
        if (this.context && this.newlines) context.add(TokenContext.Newline)
        break

        // BOOLEAN
      // -----------------------------------------------------------------
      case TokenType.Variable:
        if (this.context) context.add(TokenContext.Variable)
        break

      // BOOLEAN
      // -----------------------------------------------------------------
      case TokenType.Boolean:
        if (this.context) context.add(TokenContext.Boolean)
        break

      // NUMBERS
      // -----------------------------------------------------------------
      case TokenType.Integer:
        if (this.context) context.add(TokenContext.Integer)
        break
      case TokenType.Float:
        if (this.context) context.add(TokenContext.Float)
        break
      case TokenType.Number:
        if (this.context) context.add(TokenContext.Number)
        break

      // STRINGS
      // -----------------------------------------------------------------
      case TokenType.String:
        if (this.context) context.add(TokenContext.String)
        break
      case TokenType.StringSingleQuote:
        if (this.context) context.add(TokenContext.Object)
        break
      case TokenType.StringDoubleQuote:
        if (this.context) context.add(TokenContext.Object)
        break

      // TRIMS
      // -----------------------------------------------------------------
      case TokenType.LiquidTrimDashLeft:
        if (this.context) context.add(TokenContext.LeftTrim)
        break
      case TokenType.LiquidTrimDashRight:
        if (this.context) context.add(TokenContext.RightTrim)
        break

      case TokenType.Separator:
        if (this.context) context.add(TokenContext.Separator)
        break

      // DIAGNOSTICS
      // -----------------------------------------------------------------
      case TokenType.ParseWarning:

        ast.error.add(scanner.error)

        break

      case TokenType.ParseError:

        ast.error.add(scanner.error)

        break

      case TokenType.ParseSkip:

        if (node) {

          if (!node.singular) {
            ast.hierarch.get.pop()
            ast.hierarch.get.pop()
          }

          node = undefined
        }

        break

      // HTML TAGS
      // -----------------------------------------------------------------
      case TokenType.HTMLStartTagOpen:
        if (this.context) context.add(TokenContext.OpenTag)
        break

      case TokenType.HTMLTagName:

        ast.node = document.ast.length

        // @ts-ignore
        node = new ast.INode()

        node.type = TokenTags.associate
        node.kind = TokenKind.HTML
        node.singular = false

        if (this.context) {
          node.context.push(context.size)
          context.add(TokenContext.Identifier)
        }

        node.name = scanner.token
        ast.hierarch.get.push(node.name, node.index)

        break

      case TokenType.HTMLAttributeName:
        if (this.context) context.add(TokenContext.Attribute)
        state = scanner.token
        node.attributes[state] = null
        break
      case TokenType.HTMLOperatorValue:
        if (this.context) context.add(TokenContext.Operator)
        break
      case TokenType.HTMLAttributeValue:
        if (this.context) context.add(TokenContext.String)
        node.attributes[state] = scanner.token
        break
      case TokenType.HTMLEndTag:

        // Find hierarch - The parental node
        node = document.ast[ast.hierarch.pair]

        // Validate the parent matches the hierarch node
        if (node?.name === scanner.token) {

          // CONTEXT
          if (this.context) context.add(TokenContext.EndTag)

          node.offset(scanner.start)

          if (this.context) node.context.push(context.size)

          // AST LOGIC
          ast.node = node.index

          break
        }

        break

      case TokenType.HTMLEndTagClose:
      case TokenType.HTMLEndCommentTag:
      case TokenType.HTMLStartTagClose:

        if (!node) break

        node.offset(scanner.offset)
        node.token.push(scanner.tag)
        node.range.end = scanner.range.end

        // CONTEXT
        if (this.context) context.add(TokenContext.CloseTag)

        // ADD ONLY START BASIC TAGS TO AST
        if (token !== TokenType.HTMLEndTagClose) {

          node.language = spec.associates.match(node.name, Object.values(node.attributes))
          node.index = document.ast.length

          ast.embedded.push(node.index)

          document.ast.push(node)
        }

        break
      // LIQUID TAGS
      // -----------------------------------------------------------------
      case TokenType.LiquidTag:

        ast.node = document.ast.length

        // @ts-ignore
        node = new ast.INode()
        node.type = spec.type
        node.singular = false

        if (this.context) node.context.push(context.size)

        break

      // OUTPUT OBJECT TYPE TAGS
      // -----------------------------------------------------------------
      case TokenType.ObjectTag:

        ast.node = document.ast.length

        // @ts-ignore
        node = new ast.INode()
        node.type = spec.type

        if (this.context) node.context.push(context.size)

        break

      // SINGULAR LIQUID TAGS
      // -----------------------------------------------------------------
      case TokenType.LiquidSingularTag:

        ast.node = document.ast.length

        // @ts-ignore
        node = new ast.INode()
        node.type = spec.type

        if (this.context) node.context.push(context.size)

        break

      // BASIC END TAG
      // -----------------------------------------------------------------
      case TokenType.LiquidEndTag: {

        // Find hierarch - The parental node
        node = document.ast[ast.hierarch.pair]

        // console.log(ast.hierarch.get, node?.name, scanner.token)
        // Validate the parent matches the hierarch node
        if (node?.name === scanner.token) {

          // CONTEXT
          if (this.context) context.add(TokenContext.EndTag)

          node.offset(scanner.start)
          if (this.context) node.context.push(context.size)

          // AST LOGIC
          ast.node = node.index

          break
        }

        // The endtag is invalid - missing parental hierarch
        // create a new node on the AST representing this invalid node

        // @ts-ignore
        node = new ast.INode()
        node.offset(scanner.offset)
        if (this.context) node.context.push(context.size)

        // AST LOGIC
        ast.error.add(ParseError.InvalidSyntactic)

        // CONTEXT
        if (this.context) context.add(TokenContext.EndTag)

        break
      }
      // CLOSE TAGS
      // -----------------------------------------------------------------
      case TokenType.LiquidTagClose:
      case TokenType.LiquidEndTagClose:

        node.offset(scanner.offset)
        node.token.push(scanner.tag)
        node.range.end = scanner.range.end

        if (scanner.error === ParseError.MissingCloseDelimiter) {
          ast.error.add(scanner.error)
        }

        // CONTEXT
        if (this.context) context.add(TokenContext.CloseTag)

        // ADD ONLY START BASIC TAGS TO AST
        if (token !== TokenType.LiquidEndTagClose) {
          node.index = document.ast.length
          document.ast.push(node)
        }

        // RESETS
        node = undefined
        spec.reset()
        spec.object.reset()

        break

      // LIQUID OBJECT
      // -----------------------------------------------------------------
      case TokenType.Object:

        if (this.context) context.add(TokenContext.Object)

        // SAVE OFFSET
        spec.object.at(scanner.offset)

        node.objects = {
          ...node.objects,
          [spec.object.offset]: [ scanner.token ]
        }

        break

        // LIQUID OBJECT
      // -----------------------------------------------------------------
      case TokenType.LiquidTagName:

        if (this.context) context.add(TokenContext.Identifier)

        node.name = scanner.token

        if (!scanner.spec?.singular) {
          // ASSERT HIERARCH
          ast.hierarch.get.push(node.name, node.index)
        }

        break

      // EMBEDDED TYPES
      // -----------------------------------------------------------------
      case TokenType.Embedded:

        node.name = scanner.token
        node.type = spec.type
        node.language = spec.get.language

        // ASSERT HIERARCH
        ast.hierarch.get.push(node.name, node.index)
        ast.embedded.push(node.index)

        if (this.context) context.add(TokenContext.Identifier)

        break

      // LIQUID CONTROL CONDITION
      // -----------------------------------------------------------------
      case TokenType.Control:

        node.name = scanner.token
        node.type = spec.type

        ast.hierarch.get.push(node.name, node.index)

        if (this.context) context.add(TokenContext.Identifier)

        break

      case TokenType.ControlCondition:
        if (this.context) context.add(TokenContext.Condition)
        break
      case TokenType.ControlOperator:
        if (this.context) context.add(TokenContext.Operator)
        break

      case TokenType.ObjectBracketNotationOpen:
        if (this.context) context.add(TokenContext.OpenBracket)
        break
      case TokenType.ObjectBracketNotationClose:
        if (this.context) context.add(TokenContext.CloseBracket)
        break
      case TokenType.ObjectProperty:

        if (this.context) context.add(TokenContext.Property)

        // VALIDATE PROPERTY
        if (scanner.isError(ParseError.UnknownProperty)) ast.error.add(scanner.error)

        // PUSH NEXT PROPERTY
        node.objects[spec.object.offset].push(scanner.token)
        node.objects[scanner.offset + 1] = spec.object.offset

        // SAVE OFFSET
        spec.object.at(scanner.offset)

        break
      case TokenType.ObjectPropertyString:

        if (this.context) context.add(TokenContext.Property)

        // PUSH NEXT PROPERTY
        node.objects[spec.object.offset].push(scanner.token)
        node.objects[scanner.offset + 1] = spec.object.offset

        // SAVE OFFSET
        spec.object.at(scanner.offset)

        break
      case TokenType.ObjectPropertyNumber:
        if (this.context) context.add(TokenContext.Integer)
        break
      case TokenType.ObjectPropertyObject:
        if (this.context) context.add(TokenContext.PropertyObject)
        break
      case TokenType.ObjectDotNotation:
        if (this.context) context.add(TokenContext.Separator)
        break

      // FILTERS
      // -----------------------------------------------------------------
      case TokenType.Filter:
        if (this.context) context.add(TokenContext.Separator)
        break
      case TokenType.FilterIdentifier:
        if (this.context) context.add(TokenContext.Keyword)
        node.filters = {
          ...node.filters,
          [scanner.offset + scanner.token.length]: scanner.token
        }
        break
      case TokenType.FilterOperator:
        if (this.context) context.add(TokenContext.Operator)
        break
      case TokenType.FilterArgument:
        if (this.context) context.add(TokenContext.String)
        break
      case TokenType.FilterArgumentNumber:
        if (this.context) context.add(TokenContext.Integer)
        break
      case TokenType.FilterParameter:
        if (this.context) context.add(TokenContext.Parameter)
        break

      // LIQUID ITERATION ITEREE
      // -----------------------------------------------------------------
      case TokenType.IterationIteree:

        context.add(TokenContext.Iteree)

        break

      case TokenType.IterationOperator:
        context.add(TokenContext.Operator)
        break
      case TokenType.IterationArray:
        context.add(TokenContext.Array)
        break
      case TokenType.IterationParameter:
        context.add(TokenContext.Keyword)
        break
      case TokenType.IterationParameterValue:
        context.add(TokenContext.Integer)
        break

    }

    token = scanner.scan()

  }

  /**
   * Hierarch Errors
   *
   * We push any hierarch errors at the end of the
   * document parsing sequence.
   */
  while (ast.hierarch.get.length > 0) {
    ast.hierarch.get.shift()
    const index = ast.hierarch.get.shift()
    if (typeof index === 'number') ast.error.hierarch(document.ast[index])
  }

  // RETURN THIS SHIT

  return document

}

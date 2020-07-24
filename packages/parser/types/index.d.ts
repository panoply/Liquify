import { TagType } from "../src/lexical/tags";
import { TokenType } from "../src/enums/types";
import { TokenKind } from "../src/enums/kinds";
import { Errors } from "../src/enums/errors";

/**
 * Tags are captured and applied as an array of strings.
 * There should never be more than 2 values that exist
 * here. When the parser encounters tag blocks, value will be 2.
 */
export type Token = string[];

/**
 * Tags offsets reflect the positions of each captured token
 * in the document. Offsets will either have a value of 2 or 4.
 */
export type Offsets = number[];

/**
 * Tags offsets reflect the positions of each captured token
 * in the document. Offsets will either have a value of 2 or 4.
 */
export type Range = { line: number; character: number };

/**
 * Object properties are the the index offset location for
 * the starting point of properties.
 */
export type Objects = { [offset: string]: string[] };

/**
 * Tag filters are parsed and applied when a `|` pipe character
 * is detected within a tag. Not all tags accept filter values
 * and the parser will refer to a tags specification reference before
 * it begins parsing filters.
 */
export type Filters = { [offset: string]: string[] };

/**
 * Tag Parameters are applied to the AST Node only when detected
 * or else this property will be undefined. Tag parameters are
 * rather hard to detect in the Liquid Language as they can be applied
 * and attach value with or without seperators character (eg: `,` )
 */
export type Parameters = { [offset: string]: string[] };

/**
 * The Children property array contains the children contained
 * within a tag. It's important to not that values here are only
 * applied to token that accept accept child tags, eg: `{% else %}`
 */
export interface Children {
  name: string;
  tag: TagType;
  token: Token;
  offset: Offsets;
  range: Range;
  objects?: Objects;
}

/* -------------------------------------------- */
/*                  DIAGNOSTIC                  */
/* -------------------------------------------- */

/**
 * The diagnostic tags.
 */
export enum DiagnosticTag {
  /**
   * Unused or unnecessary code.
   *
   * Clients are allowed to render diagnostics with this tag faded out instead of having
   * an error squiggle.
   */
  Unnecessary = 1,
  /**
   * Deprecated or obsolete code.
   *
   * Clients are allowed to rendered diagnostics with this tag strike through.
   */
  Deprecated = 2,
}

export interface ParseErrors {
  /**
   * The range at which the message applies
   */
  range: Range;
  /**
   * The diagnostic's severity. Can be omitted. If omitted it is up to the
   * client to interpret diagnostics as error, warning, info or hint.
   */
  severity?: Errors;
  /**
   * The diagnostic's message. It usually appears in the user interface
   */
  message: string;
  /**
   * Additional metadata about the diagnostic.
   */
  code?: DiagnosticTag[];
}

/* -------------------------------------------- */
/*                      AST                     */
/* -------------------------------------------- */
export interface ASTNode {
  name: string;
  token: Token;
  tag?: TagType;
  type: TokenType;
  kind?: TokenKind;
  offset: Offsets;
  objects?: Objects;
  filters?: Filters;
  parameters?: Parameters;
  children?: Children[];
  languageId?: string;
  paths?: number;
}

/**
 * Parsed Diagnostics Array
 *
 * @export
 */
export type ParsedDiagnostics = [number, Promise<object[]>];

/* -------------------------------------------- */
/*                    EXPORT                    */
/* -------------------------------------------- */

export as namespace Parser;

import { spec, IEngine } from '@liquify/liquid-language-specs';
import { VersionedTextDocumentIdentifier, Range } from 'vscode-languageserver-types';
import { parse } from 'parser/parse';
import { create, update, get, remove, model } from 'tree/model';
import { IAST } from './tree/ast';
import { Config, IConfig } from './config';

/* EXPOSED EXPORTS ---------------------------- */

export * from '@liquify/liquid-language-specs';
export { TextDocument, Position, Range } from 'vscode-languageserver-textdocument';
export { IAST } from './tree/ast';
export { Node as INode } from './tree/nodes';
export { Embed as IEmbed } from './tree/embed';
export { NodeLanguage } from './lexical/language';
export { NodeKind } from './lexical/kind';
export * as Characters from './lexical/characters';

export class LiquidParser {

  static engine (engine: IEngine) {

    return spec.SetEngine(engine);

  }

  constructor (options: IConfig) {

    Object.assign(Config, options);

    spec.SetEngine(Config.engine);

  }

  get spec () {

    return spec.GetVariation();

  }

  /**
     * Change Specification Engine
     */
  engine (engine: IEngine): void {

    return spec.SetEngine(engine);

  }

  parse (text: string) {

    if (model.has('raw')) {
      // model.get('raw').errors = [];
      model.delete('raw');
    }

    return parse(
      create(
        {
          uri: 'raw',
          languageId: 'raw',
          version: 1,
          text
        }
      )
    );
  }

  /**
   * Executes a full document scan. Call this method to create
   * a document reference and perform a full text scan.
   */
  scan (
    textDocument: {
      uri: string,
      languageId: string,
      version: number,
      text: string
    }
  ): IAST {

    return parse(create(textDocument));
  }

  get (uri: string): IAST {

    return get(uri);
  }

  delete (uri: string) {

    return remove(uri);
  }

  update (
    {
      textDocument,
      contentChanges
    }: {
        textDocument: VersionedTextDocumentIdentifier,
        contentChanges: {
          range: Range,
          text: string
        }[]
      }
  ): IAST {

    return parse(
      update(
        textDocument,
        contentChanges
      )
    );
  }

}

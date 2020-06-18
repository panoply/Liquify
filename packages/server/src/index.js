// @ts-nocheck

import { DidChangeConfigurationNotification, TextDocumentSyncKind } from 'vscode-languageserver'
import { connection, Server, Service, Document, Parser } from './export'
import { runAsync, runSync } from './utils/runners'
import { mark, stop } from 'marky'

/* ---------------------------------------------------------------- */
/* onInitialize                                                     */
/* ---------------------------------------------------------------- */

/**
 * @param {import('vscode-languageserver').InitializeParams} initializeParams
 */
connection.onInitialize(initializeParams => (

  Server.capabilities(initializeParams, {
    textDocumentSync: {
      openClose: true,
      change: TextDocumentSyncKind.Incremental,
      willSaveWaitUntil: true,
      save: {
        includeText: false
      }
    },
    documentRangeFormattingProvider: true,
    hoverProvider: true,
    documentLinkProvider: {
      resolveProvider: true
    },
    /* codeLensProvider: {
      workDoneProgress: true,
      resolveProvider: true
    }, */
    completionProvider: {
      resolveProvider: true,
      triggerCharacters: [ '"', ':', '|', '.', '<' ]
    },
    implementationProvider: true,
    executeCommandProvider: {
      commands: [
        'liquid.liquidrc',
        'liquid.enableFormatting',
        'liquid.disableFormatting',
        'liquid.formatDocument',
        'liquid.formatSelection',
        'liquid.toggleOutput',
        'liquid.enableValidation',
        'liquid.disableValidation',
        'liquid.changeEngine',
        'liquid.codelens'
      ]
    }
  })

))

/* ---------------------------------------------------------------- */
/* onInitialized                                                    */
/* ---------------------------------------------------------------- */

connection.onInitialized(() => {

  connection.console.log('onInitialized')

  if (Server.hasConfigurationCapability) {
    connection.client.register(DidChangeConfigurationNotification.type, undefined)
  }

  if (Server.hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders(event => {
      connection.connection.console.log('Workspace folder change event received.')
    })
  }

  Service.configure(Server.service)

})

/* ---------------------------------------------------------------- */
/* onDidChangeConfiguration                                         */
/* ---------------------------------------------------------------- */

connection.onDidChangeConfiguration(change => {

  connection.console.log('onDidChangeConfiguration')

  Server.configure('onDidChangeConfiguration', change.settings)

  // documents.forEach(Service.doValidation)

})

/* ---------------------------------------------------------------- */
/* onDidOpenTextDocument                                            */
/* ---------------------------------------------------------------- */
connection.onDidOpenTextDocument(({ textDocument }) => {

  connection.console.log('onDidOpenTextDocument')

  // connection.console.log(Server)
  Document.create(textDocument)(Parser.scanner)
  // Document.create(textDocument)(Parser.scanner)

  // documents.forEach(Service.doValidation)

  /* return Service.doValidation(document).then(({
    uri
    , diagnostics
  }) => (
    connection.sendDiagnostics({
      uri,
      diagnostics
    })
  )) */

})

/* ---------------------------------------------------------------- */
/* onDidChangeTextDocument                                          */
/* ---------------------------------------------------------------- */

connection.onDidChangeTextDocument(
  ({
    contentChanges
    , textDocument
  }) => {

    connection.console.log('onDidChangeTextDocument', textDocument.uri)

    mark('onDidChangeTextDocument')

    const { document, changes } = Document.update(textDocument, contentChanges)

    if (!document?.uri) return null

    Parser.increment(document, ...changes)

    console.log(document)

    // return connection.console.log('total time  taken = ' + (v2 - v1) + 'milliseconds')

    // return Documents.set(textDocument.uri)

    // const parserd = await Parser(document, contentChanges)

    Service.doValidation(document).then(({
      uri
      , diagnostics
    }) => (
      connection.sendDiagnostics({
        uri,
        diagnostics
      })
    ))

    // const v2 = performance.now()

  }
)

/* ---------------------------------------------------------------- */
/* onDidClose                                                       */
/* ---------------------------------------------------------------- */

connection.onDidCloseTextDocument(({ textDocument: { uri } }) => (

  documents.delete(uri)

))

/* ---------------------------------------------------------------- */
/* onDidChangeWatchedFiles                                          */
/* ---------------------------------------------------------------- */

connection.onDidChangeWatchedFiles(change => {

  connection.console.log('onDidChangeWatchedFiles')

  Server.configure('onDidChangeWatchedFiles', change)

})

/* ---------------------------------------------------------------- */
/* onDocumentRangeFormatting                                        */
/* ---------------------------------------------------------------- */

connection.onDocumentRangeFormatting(
  ({
    textDocument: { uri }
  }, token) => !Server.provider.format || runSync(() => {

    return null
    const document = documents.get(uri)

    if (!document.uri) return null

    return Service.doFormat(document, Server.format)

  }, null, `Error while computing formatting for ${uri}`, token)
)

/* ---------------------------------------------------------------- */
/* onHover                                                          */
/* ---------------------------------------------------------------- */

connection.onHover(
  ({
    position
    , textDocument: { uri }
  }, token) => !Server.provider.hover || runSync(() => {

    return null

    const document = documents.get(uri)

    if (!document.uri) return null

    return Service.doHover(document, position)

  }, null, `Error while computing hover for ${uri}`, token)
)

/* ---------------------------------------------------------------- */
/* onCodeLens                                                       */
/* ---------------------------------------------------------------- */

/* connection.onCodeLens(
  ({
    partialResultToken,
    textDocument: { uri }
  }, token) => runSync(() => {

    const document = documents.get(uri)

    if (!document.uri) return null

    return Document.includes(uri)

  }, null, `Error while computing completion for ${uri}`, token)
) */

/* ---------------------------------------------------------------- */
/* onCodeLensResolve                                                */
/* ---------------------------------------------------------------- */

/* connection.onCodeLensResolve(
  (
    item
    , token
  ) => runSync(() => {

    return item

  }, item, 'Error while resolving completion proposal', token)
)
*/
/* ---------------------------------------------------------------- */
/* onDocumentLinks                                            */
/* ---------------------------------------------------------------- */

connection.onDocumentLinks(
  ({
    textDocument: { uri }
  }, token) => runSync(() => {

    return null

    const document = documents.get(uri)

    if (!document.uri) return null

    return Document.links(uri)

  }, null, `Error while computing completion for ${uri}`, token)
)

/* ---------------------------------------------------------------- */
/* onDocumentLinkResolve                                            */
/* ---------------------------------------------------------------- */

connection.onDocumentLinkResolve(
  (
    item
    , token
  ) => runSync(() => {

    return null

    return item

  }, item, 'Error while resolving completion proposal', token)
)

/* ---------------------------------------------------------------- */
/* onCompletion                                                     */
/* ---------------------------------------------------------------- */

connection.onCompletion(
  ({
    position
    , textDocument: { uri }
    , context
  }, token) => !Server.provider.completion || runAsync(async () => {

    return null

    const document = documents.get(uri)

    if (!document.uri) return null

    const onComplete = await Service.doComplete(document, position, context)

    return onComplete

  }, null, `Error while computing completion for ${uri}`, token)
)

/* ---------------------------------------------------------------- */
/* onCompletionResolve                                              */
/* ---------------------------------------------------------------- */

connection.onCompletionResolve(
  (
    item
    , token
  ) => runSync(() => {

    return null

    return Service.doCompleteResolve(item)

  }, item, 'Error while resolving completion proposal', token)
)

/* ---------------------------------------------------------------- */
/* onExecuteCommand                                                 */
/* ---------------------------------------------------------------- */

connection.onExecuteCommand(
  (
    item
    , token
  ) => runSync(() => {

    return null

    return item.arguments[0]

  }, item, 'Error while resolving completion proposal', token)
)

/* ---------------------------------------------------------------- */
/* Connection Listener                                              */
/* ---------------------------------------------------------------- */

connection.listen()

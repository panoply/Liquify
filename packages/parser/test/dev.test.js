import test from 'ava';
import time from 'pretty-hrtime';
import * as parser from './cases/__utils__';
import Stringify from 'json-stringify-safe';

const text = `

{{ article.published_at | time_tag: '%a, %b %d, %Y' }}
{{ article.published_at | time_tag: '%Y', format: 'date'  }}
{{ article.published_at | time_tag: format: 'date'  }}
{{ article.published_at | time_tag: '%a, %b %d, %Y', datetime: '%Y-%m-%d', format: 'date' }}

{{ foo | font_modify: 'weight', '100' }}
{{ foo | font_modify: 'style', 'normal' }}

{{ foo | asset_img_url: '200x', crop: 'top', format: 'pjpg', scale: 2 }}

`;

function Stack (ast) {

  const arr = [];

  for (let i = 0; i < ast.nodes.length; i++) {
    const node = ast.nodes[i];
    const stack = [ node ];

    for (const child of stack) {
      arr.push({
        tag: child.tag,
        root: child.root,
        index: child.index,
        start: child.start,
        type: child.type,
        end: child.end,
        scope: child.scope,
        children: child.children.map(({ tag }) => tag),
        filters: child.filters || null,
        objects: child.objects || null,
        parent: child.parent.tag === 'ROOT' ? 'ROOT' : {
          tag: child.parent.tag,
          start: child.parent.start,
          end: child.parent.end,
          index: child.parent.index,
          root: child.parent.root,
          children: child.parent.children.length
        }

      });
      if (child.parent) stack.push(...child.children);
    }

  }

  return arr;
}

test('FullDocument Parse', t => {

  const start = process.hrtime();

  const ast = parser.scan({
    languageId: 'liquid',
    version: 1,
    text,
    uri: 'test.liquid'
  });

  const end = process.hrtime(start);
  console.log(Stack(ast));

  // console.log(...ast.nodes);
  // console.log(ast.getHTMLNodes());

  // console.log(ast.diagnostics.length);
  // console.log(...ast.diagnostics);

  for (const n of ast.errors) console.log(n, ast.getText(n.range));

  // console.log(ast.nodes[0].getToken());

  // console.log(ast.nodes);

  t.log(time(end, { verbose: true }));
  t.pass();

});

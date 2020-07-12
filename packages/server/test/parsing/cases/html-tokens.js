export default ([
  {
    title: 'HTML TAG\n',
    capture: {
      regex: /[\w]+/g,
      colour: 'redBright',
      stringify: false
    },
    tests: ([
      [
        '<script>',
        '</script>'
      ],
      [
        '<style>',
        '</style>'
      ]
    ])
  },
  {
    title: 'HTML TAG TABS\n',
    capture: {
      regex: /[\\][t]/g,
      colour: 'blueBright',
      stringify: true
    },
    tests: ([
      [
        '<script\t\t>',
        '</script\t\t>'
      ]
    ])
  },
  {
    title: 'HTML TAG NEWLINES\n',
    capture: {
      regex: /[\\][n]/g,
      colour: 'blueBright',
      stringify: true
    },
    tests: ([
      [
        '<script\n>',
        '</script\n>'
      ],
      [
        '<script\n\n\n\n>',
        '</script\n\n\n>'
      ]
    ])
  },
  {

    title: 'HTML TAG STRING SKIP\n',
    capture: {
      regex: /[\\"'][^\\'"]+[\\"']/g,
      colour: 'yellowBright',
      stringify: false
    },
    tests: ([
      [
        '<script data-attr="<script>">',
        '</script>',
        '<style data-attr=">><< >>>">',
        '</style>'
      ]
    ])

  }
])

module.exports = [
  {
    type: 'list',
    name: 'import',
    default: 'full',
    message: '请选择引入方式?',
    choices: [
      { name: '全部引入', value: 'full' },
      { name: '局部引入', value: 'partial' }
    ]
  }
]

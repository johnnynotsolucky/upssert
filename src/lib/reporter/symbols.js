const symbols = {
  ok: '✓',
  error: '✖',
  ellipsis: '…',
  listMultiple: '├',
  listSingle: '└'
}

if (process.platform === 'win32') {
  symbols.ok = '\u221A'
  symbols.error = '\u00D7'
}

export default symbols

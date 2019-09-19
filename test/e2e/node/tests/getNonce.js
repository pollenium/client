const utils = require('../utils')

const getMaxHash = utils.pollenium.utils.getMaxHash
const getNonce = utils.pollenium.utils.getNonce
const getNow = utils.pollenium.utils.getNow

const noncelessPrehash = utils.pollenium.Bytes.random(32)

describe('getNonce (non-worker)', () => {
  for (let difficulty = 0; difficulty <= 8; difficulty++) {
    it(`difficulty:${difficulty}`, () => {
      getNonce(noncelessPrehash, difficulty, getNow() + 30)
    })
  }
})
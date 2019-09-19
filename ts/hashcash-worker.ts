import { Bytes } from './classes/Bytes'
import { getNonce } from './utils'
import { HASHCASH_RESOLUTION_KEY } from './interfaces/HashcashResolution'


// eslint-disable-next-line no-undef
onmessage = (event): void => {
  const hashcashRequest = event.data

  const noncelessPrehash = Bytes.fromHex(hashcashRequest.noncelessPrehashHex)

  try {
    const nonce = getNonce(
      noncelessPrehash,
      hashcashRequest.difficulty,
      hashcashRequest.timeoutAt
    )
    // eslint-disable-next-line no-undef
    postMessage({
      key: HASHCASH_RESOLUTION_KEY.NONCE_HEX,
      value: nonce.getHex()
    }, [])
  } catch (err) {
    // eslint-disable-next-line no-undef
    postMessage({
      key: HASHCASH_RESOLUTION_KEY.TIMEOUT_ERROR
    }, [])
  }
}
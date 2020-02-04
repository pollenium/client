import { Friendship, FRIENDSHIP_STATUS, DESTROY_REASON, FriendshipStruct } from '../Friendship'
import { Offer } from '../Signal/Offer'
import SimplePeer from 'simple-peer'
import { genSimplePeerConfig } from '../../utils/genSimplePeerConfig'
import Wrtc from 'wrtc'
import delay from 'delay'

export class Introvert extends Friendship {

  constructor(offer: Offer, struct: Omit<FriendshipStruct, 'initiator'>) {
    super({
      ...struct,
      initiator: false
    })
    this.setPeerClientId(offer.clientId)
    this.setStatus(FRIENDSHIP_STATUS.CONNECTING)
    this.sendSignal({
      type: 'offer',
      sdpb: offer.sdpb
    })
    this.startConnectOrDestroyTimeout()
  }

}

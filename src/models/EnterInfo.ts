export interface EnterInfo {
  type: 'enter'
  id: string
  country: string
  sex?: 'm' | 'w'
}

export interface RtcOffer {
  type: 'rtcOffer'
  data: any
  senderId: string
  receiverId: string
}

export interface RtcAnswer {
  type: 'rtcAnswer'
  data: any
  senderId: string
  receiverId: string
}

export interface ConnectSocketToken {
  sender: EnterInfo
  receiver: EnterInfo
}

export interface RtcOfferToken {
  senderId: string
  receiverId: string
  data: any
}

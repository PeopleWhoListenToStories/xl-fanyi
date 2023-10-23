import { Languages } from './config'

export type TextInfo = { text: string; from: Languages; to: Languages }

export type WaitResolve = { text: string; dst: string }
export type WaitList = {
  text: string
  fromTo: string
  to: Languages
  from: Languages
  resolve: (res: WaitResolve) => void
  reject: (err?: any) => void
}

export type StartTranslate = (target: any) => Promise<any>

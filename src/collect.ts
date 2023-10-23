import { TranslateNames } from './config'
import { StartTranslate, TextInfo, WaitList, WaitResolve } from './type'
import { cutArray } from './utils'

import { groupBy } from 'lodash-es'

class Collect {
  time: number = 200
  timer?: NodeJS.Timeout
  waitList: WaitList[] = []
  constructor(public startTranslate: StartTranslate) {
    this.start()
  }
  protected removeWaitList(waitList: WaitList[]) {
    // this.waitList = _.remove(this.waitList, (item) => waitList.includes(item))
  }

  protected start() {
    this.timer = setTimeout(async () => {
      const { waitList } = this
      this.waitList = []
      const cutWaitList = waitList
      cutWaitList.forEach((textInfoTarget) => {
        // const group = textInfoTarget['fromTo']
        // const group = groupBy(textInfoList, 'fromTo')
        this.startTranslate(textInfoTarget)
      })
      // for await (const iterator of cutWaitList) {
      //   const group = _.groupBy(iterator, 'fromTo')
      //   await this.startTranslate(Object.entries(group))
      // }
      // if (cutWaitList.length > 10) {
      //   const doubleCutWaitList = cutArray(cutWaitList, 10)
      //   let index = 0
      //   for await (const pages of doubleCutWaitList) {
      //     index++
      //     console.log(`第 ${index} 批翻译`)
      //     await Promise.all(
      //       pages.map(async (textInfoList) => {
      //         const group = groupBy(textInfoList, 'fromTo')
      //         await this.startTranslate(Object.entries(group))
      //       }),
      //     )
      //   }
      // } else {
      //   cutWaitList.forEach((textInfoList) => {
      //     const group = groupBy(textInfoList, 'fromTo')
      //     this.startTranslate(Object.entries(group))
      //   })
      // }
    }, this.time)
  }

  protected reStart() {
    // 1、清楚定时器
    // 2、重新几时
    clearTimeout(this.timer)
    this.start()
  }

  add({ text, from, to }: TextInfo) {
    this.reStart()
    text = text //.replace(/\r?\n/g, SPLIT_ENTER) // 去除换行符
    return new Promise<WaitResolve>((resolve, reject) => {
      this.waitList.push({ text, fromTo: `${from}_${to}`, from, to, resolve, reject })
    })
  }
}

class Collector {
  protected collectList: { key: TranslateNames; collect: Collect }[] = []

  createCollect(key: TranslateNames, translate: StartTranslate) {
    if (!this.collectList.some((i) => i.key === key)) {
      this.collectList.push({ key, collect: new Collect(translate) })
    }
  }

  getCollect(key: TranslateNames) {
    return this.collectList.find((i) => i.key === key)?.collect
  }

  addTranslate(info: TextInfo, key: TranslateNames) {
    const collect = this.getCollect(key)
    if (!collect) throw new Error(`${key} collect is not defined`)
    return collect.add(info)
  }
}

export { Collector }

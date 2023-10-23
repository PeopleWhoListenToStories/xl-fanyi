import { TranslateNames, Languages } from './config'
import { TextInfo } from './type'
import { Collector } from './collect'
import _youDaoTranslator from './youdao'

const collector = new Collector()

const youDaoTranslator = (info: TextInfo) => {
  const key = TranslateNames.YOUDAO
  collector.createCollect(key, _youDaoTranslator)
  return collector.addTranslate(info, key)
}

export { youDaoTranslator, Languages }

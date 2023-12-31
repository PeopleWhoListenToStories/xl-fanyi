export const JOIN_STR = '\n'
export const SPLIT_STR = '\n'
export const SPLIT_ENTER = '9999999999999'
export const SPLIT_ENTER_REG = new RegExp(SPLIT_ENTER.split('').join('\\s?'), 'g')

export enum TranslateNames {
  BING = 'baidu',
  BAIDU = 'baidu',
  YOUDAO = 'youdao',
  IFLYREC = 'iflyrec',
}

export enum Languages {
  /**
   * 汉语
   */
  ZH = 'zh',
  /**
   * 英语
   */
  EN = 'en',
  /**
   * 俄语
   */
  RU = 'ru',
  /**
   * 日语
   */
  JP = 'jp',
  /**
   * 韩语
   */
  KOR = 'kor',
  /**
   * 法语
   */
  FRA = 'fra',
  /**
   * 德语
   */
  DE = 'de',
}

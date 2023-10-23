import { Languages } from "./config"

export function cutArray<T>(array: T[], subLength: number): T[][]{
  let index = 0
  let newArr = []
  while (index < array.length) {
    newArr.push(array.slice(index, (index += subLength)))
  }
  return newArr
}

export const getLanguage = (language: Languages) => {
  switch (language) {
    case Languages.ZH:
      return 'zh-Hans'
    case Languages.EN:
      return 'en'
    case Languages.RU:
      return 'ru'
    case Languages.JP:
      return 'ja'
    case Languages.KOR:
      return 'ko'
    case Languages.DE:
      return 'de'
    case Languages.FRA:
      return 'fr'
  }
}
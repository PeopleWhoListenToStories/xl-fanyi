// import qs from 'qs'
// import axios from 'axios'
// import FormData from 'form-data'
// import { WaitList } from './collect'
// import { restoreEnter } from './utils'
// import { JOIN_STR, Languages, SPLIT_ENTER, SPLIT_STR } from './config'
// import config, { getApiHeaders, getHostHeaders, getHostInfo, getToken } from './common'
// import fetch from 'node-fetch';
import axios from 'axios'
// import chalk from 'chalk'
import CryptoJS from 'crypto-js'
// console.log(`%c 👩‍👩‍👦 🚀 : CryptoJS `, `font-size:14px;background-color:#e5a3e8;color:white;`, CryptoJS);
import { WaitList } from './type'

const YOUDAO_URL = 'http://openapi.youdao.com/api'
const appKey = '22886327856afdbd'
const key = 'mCyYPhxqV7vCtvfeGmFfPkgiI7eiwDI3' //注意：暴露appSecret，有被盗用造成损失的风险
const salt = new Date().getTime()
const curtime = Math.round(new Date().getTime() / 1000)
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
const from = 'zh-CHS'
const to = 'en'

function truncate(q: string) {
  var len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

class YouDao {}

export const formatYouDaoJson = (dataJson: { [key: string]: any }): string => {
  let inputValue = ''
  let webList = ''
  inputValue = `\n  ${dataJson.query} : ${dataJson.translation || ''}   ${
    dataJson.basic ? dataJson.basic?.phonetic || dataJson.basic?.explains : ''
  }`
  formatterArrayReverse(dataJson.web).forEach((item, index) => {
    Object.keys(item).forEach((v, i) => {
      webList += `\n\n  ${item[v]} `
    })
  })
  // console.log(inputValue, webList)
  return `${inputValue}${webList}`
}

/**
 * 格式化数组 把数组里面的对象翻转
 * @param {Array} params
 * @returns []
 */
function formatterArrayReverse<T>(params: Array<T>) {
  if (Object.prototype.toString.call(params) !== '[object Array]') {
    return []
  }
  return params.map((other: any) => {
    let result: { [key: string]: T } = {}
    Object.keys(other)
      .reverse()
      .forEach((inner) => {
        result[inner] = other[inner]
      })
    return result
  })
}

const youDaoTranslator = async (data: any) => {
  // const { text, from, to, resolve } = data
  const List = [data].map(async (item) => {
    try {
      const sign = CryptoJS.SHA256(appKey + truncate(item.text) + salt + curtime + key).toString(CryptoJS.enc.Hex)

      const { status, data: responseData } = await axios(YOUDAO_URL, {
        method: 'GET',
        params: {
          q: item.text,
          appKey: appKey,
          salt: salt,
          from: item.from || from,
          to: item.to || to,
          sign: sign,
          signType: 'v3',
          curtime: curtime,
        },
      })
      if (status === 200) {
        item.resolve(formatYouDaoJson(responseData))
      } else {
        item.resolve(responseData)
      }
    } catch (error) {
      console.error(error)
      throw new Error('translate fail')
    }
  })
  return Promise.all(List)
}

export default youDaoTranslator

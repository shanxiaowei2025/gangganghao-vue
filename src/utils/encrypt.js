/**
 * 数据加密工具函数
 * 用于处理敏感信息（身份证号、手机号等）的加密和脱敏
 */

/**
 * 加密身份证号
 * 显示格式：首位 + *** + 末位
 * 例如：123456789012345678 -> 1***8
 *
 * @param {string} idCard - 身份证号
 * @returns {string} 加密后的身份证号
 */
export const encryptIdCard = (idCard) => {
  if (!idCard || typeof idCard !== 'string') {
    return ''
  }

  const trimmed = idCard.trim()
  if (trimmed.length < 2) {
    return trimmed
  }

  // 显示首位和末位，中间用 * 替代
  const first = trimmed.charAt(0)
  const last = trimmed.charAt(trimmed.length - 1)
  const asterisks = '*'.repeat(Math.max(trimmed.length - 2, 3))

  return `${first}${asterisks}${last}`
}

/**
 * 加密手机号
 * 显示格式：前3位 + *** + 后2位
 * 例如：13812345678 -> 138***5678
 *
 * @param {string} phone - 手机号
 * @returns {string} 加密后的手机号
 */
export const encryptPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return ''
  }

  const trimmed = phone.trim()

  // 手机号通常是11位，显示前3位和后4位
  if (trimmed.length >= 7) {
    const first = trimmed.substring(0, 3)
    const last = trimmed.substring(trimmed.length - 4)
    return `${first}****${last}`
  }

  // 如果长度不足，显示首位和末位
  if (trimmed.length >= 2) {
    const first = trimmed.charAt(0)
    const last = trimmed.charAt(trimmed.length - 1)
    const asterisks = '*'.repeat(Math.max(trimmed.length - 2, 3))
    return `${first}${asterisks}${last}`
  }

  return trimmed
}

/**
 * Base64编码（可逆加密）
 * 用于需要解密的场景
 *
 * @param {string} str - 需要编码的字符串
 * @returns {string} Base64编码后的字符串
 */
export const encodeBase64 = (str) => {
  if (!str || typeof str !== 'string') {
    return ''
  }

  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (error) {
    console.error('Base64编码失败:', error)
    return ''
  }
}

/**
 * Base64解码
 * 用于解密Base64编码的字符串
 *
 * @param {string} encodedStr - Base64编码的字符串
 * @returns {string} 解码后的字符串
 */
export const decodeBase64 = (encodedStr) => {
  if (!encodedStr || typeof encodedStr !== 'string') {
    return ''
  }

  try {
    return decodeURIComponent(escape(atob(encodedStr)))
  } catch (error) {
    console.error('Base64解码失败:', error)
    return ''
  }
}

/**
 * 通用脱敏函数
 * 根据类型自动选择脱敏方式
 *
 * @param {string} value - 需要脱敏的值
 * @param {string} type - 脱敏类型：'idCard'|'phone'|'email'|'name'
 * @returns {string} 脱敏后的值
 */
export const maskSensitiveData = (value, type = 'text') => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()

  switch (type.toLowerCase()) {
    case 'idcard':
    case 'id_card':
      return encryptIdCard(trimmed)

    case 'phone':
    case 'mobile':
      return encryptPhone(trimmed)

    case 'email':
      return maskEmail(trimmed)

    case 'name':
      return maskName(trimmed)

    default:
      return trimmed
  }
}

/**
 * 脱敏邮箱
 * 例如：user@example.com -> u***@example.com
 *
 * @param {string} email - 邮箱地址
 * @returns {string} 脱敏后的邮箱
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return ''
  }

  const trimmed = email.trim()
  const atIndex = trimmed.indexOf('@')

  if (atIndex <= 1) {
    return trimmed
  }

  const username = trimmed.substring(0, atIndex)
  const domain = trimmed.substring(atIndex)

  if (username.length <= 1) {
    return trimmed
  }

  const first = username.charAt(0)
  const asterisks = '*'.repeat(Math.max(username.length - 1, 1))

  return `${first}${asterisks}${domain}`
}

/**
 * 脱敏姓名
 * 例如：张三 -> 张* 或 张三丰 -> 张*丰
 *
 * @param {string} name - 姓名
 * @returns {string} 脱敏后的姓名
 */
export const maskName = (name) => {
  if (!name || typeof name !== 'string') {
    return ''
  }

  const trimmed = name.trim()

  if (trimmed.length <= 1) {
    return trimmed
  }

  if (trimmed.length === 2) {
    return trimmed.charAt(0) + '*'
  }

  // 长度 >= 3
  const first = trimmed.charAt(0)
  const last = trimmed.charAt(trimmed.length - 1)
  const asterisks = '*'.repeat(trimmed.length - 2)

  return `${first}${asterisks}${last}`
}

/**
 * 批量脱敏对象中的敏感字段
 *
 * @param {object} obj - 需要脱敏的对象
 * @param {array} sensitiveFields - 敏感字段配置数组
 *   例如：[
 *     { field: 'idCard', type: 'idCard' },
 *     { field: 'phone', type: 'phone' },
 *     { field: 'name', type: 'name' }
 *   ]
 * @returns {object} 脱敏后的对象副本
 */
export const maskObjectFields = (obj, sensitiveFields = []) => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const maskedObj = { ...obj }

  sensitiveFields.forEach(({ field, type }) => {
    if (field in maskedObj && maskedObj[field]) {
      maskedObj[field] = maskSensitiveData(maskedObj[field], type)
    }
  })

  return maskedObj
}

export default {
  encryptIdCard,
  encryptPhone,
  encodeBase64,
  decodeBase64,
  maskSensitiveData,
  maskEmail,
  maskName,
  maskObjectFields
}

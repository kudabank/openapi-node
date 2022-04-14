const axios = require('axios')
const shortid = require('shortid')

// import algo-methods
const { aesEncrypt, aesDecrypt } = require('./algorithms/aes')
const { RSAEncrypt, RSADecrypt } = require('./algorithms/rsa')

/**
 * @description initialize the Kuda wrapper function
 * @param {object} param => publicKeyPath, privateKeyPath, clientKey
 * @return {function} request function
 */
function Kuda (param) {
  if (!param) return console.log('Error: publicKey, privateKey, clientKey are required!')

  let { publicKey, privateKey } = param
  publicKey = publicKey.toString()
  privateKey = privateKey.toString()

  const { clientKey } = param
  
  if (!publicKey) return console.log('Error: publicKey is required!')
  if (!privateKey) return console.log('Error: privateKey is required!')
  if (!clientKey) return console.log('Error: clientKey is required!')
  
  const password = `${clientKey}-${shortid.generate().substring(0, 5)}`

  /**
   * makes an encrypted call to Kuda API
   * @param {object} params => serviceType, requestRef, data
   * @param {function} callback gets called with the result(data) object
   * @return {object} data return decrypted data response object
   */
  async function request (params, callback) {
    if (!params) return console.log('Error: serviceType, requestRef and data are required!')

    const { serviceType, requestRef, data } = params

    const payload = JSON.stringify({
      serviceType,
      requestRef,
      data
    })

    try {
      // aes encrypt payload with password
      const encryptedPayload = await aesEncrypt(payload, password)
      // rsa encrypt password with public key
      const encryptedPassword = await RSAEncrypt(password, publicKey)

      // make encrypted api request to Kuda Bank
      //Test url below
      //https://kuda-openapi-uat.kudabank.com/v1
      const { data: encryptedResponse } = await axios.post('https://kuda-openapi.kuda.com/v1', {
        data: encryptedPayload
      }, {
        headers: {
          password: encryptedPassword
        }
      })

      // plaintext = RSA decrypt password with our privateKey
      const plaintext = await RSADecrypt(encryptedResponse.password, privateKey).toString()
      // data = AES decrypt data with plaintext
      let data = await aesDecrypt(encryptedResponse.data, plaintext)
      if (typeof data === 'string') data = JSON.parse(data)

      // console.log('encrypted response:', JSON.stringify({
      //   encryptedResponse,
      //   plaintext,
      //   data: JSON.parse(data)
      // }, null, 2))

      if (callback) return callback(data)

      return data
    } catch (err) {
      console.log(err.stack)
    }
  }

  return request
}

module.exports = Kuda

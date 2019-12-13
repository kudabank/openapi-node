const JSEncrypt = require('node-jsencrypt')
const RSAXML = require('rsa-xml')

const { parsePublicXMLKey } = require('../utils')

const jsEncrypt = new JSEncrypt()

module.exports.RSAEncrypt = (text, publicKey) => {
  try {
    publicKey = parsePublicXMLKey(publicKey)
    jsEncrypt.setPublicKey(publicKey)
    const encrypted = jsEncrypt.encrypt(text)
    return encrypted
  } catch (e) {
    console.log('Error:', e.stack)
  }
}

module.exports.RSADecrypt = (encryptedText, privateKey) => {
  const rsa = new RSAXML()
  rsa.importKey(privateKey)
  var decrypted = rsa.decrypt(encryptedText)
  return decrypted
}

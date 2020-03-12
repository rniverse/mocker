module.exports = class Basics {
  static generateRandomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNPQRSTUVWXYZabdefghijmnqrtu0123456789';
    let randomString = '';
    for (let i = 0; i < len; i += 1) {
      const randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }
};

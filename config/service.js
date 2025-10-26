module.exports = {
   recaptcha: {
      client_key: '6Lf53n0fAAAAAHYYUZJIacFTjcfp4srLoBactbix',
      secret_key: '6Lf53n0fAAAAAFBxH63JDwK-d3Vt-qrFfgekpyF6',
      options: {hl: 'fa'}
   },
   google : {
      client_key :process.env.GOOGLE_CLIENTKEY ,
      secret_key :process.env.GOOGLE_SECRETKEY ,
      callback_url :process.env.GOOGLE_CALLBACKURL
   }
}
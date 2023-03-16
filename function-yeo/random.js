function generateRandomAlphaNumeric() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 20; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  module.exports = {
    generateRandomAlphaNumeric: generateRandomAlphaNumeric
  };
  
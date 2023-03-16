function generateRandomAlphaNumeric() {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 19; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + 'L';
  }
  
  module.exports = {
    generateRandomAlphaNumeric: generateRandomAlphaNumeric
  };
  
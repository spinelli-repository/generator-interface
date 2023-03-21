function generateRandomLong() {
    var result = '';
    var characters = '1234567890';
    var charactersLength = characters.length;
    for ( var i = 0; i < 16; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return '000' + result + 'L';
  }
  
  module.exports = {
    generateRandomLong: generateRandomLong
  };
  
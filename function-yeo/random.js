function generateRandomLong() {
    var result = '';
    var characters = '1234567890';
    var charactersLength = characters.length;
    for ( var i = 0; i < 19; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + 'L';
  }
  
  module.exports = {
    generateRandomLong: generateRandomLong
  };
  
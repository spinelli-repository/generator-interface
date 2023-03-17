function switchField(field) {
  if(isISO8601Date(field)){
    return field.length < 10 ? 'date' : 'datetime';
  }
    var temp = typeof field;
    if(temp == 'number'){
      return hasDot(field) ? 'double' : 'integer';
    }else if (temp == 'boolean'){
      return 'boolean';
    }
    return 'string';
  
}

var determinedTypeToJavaType = {
	"date": "LocalDate",
	"datetime": "LocalDateTime",
	"string": "String",
	"double": "BigDecimal",
	"integer": "BigInteger",
	"boolean": "Boolean"
}

var determinedTypeToTypescriptType = {
	"date": "Date",
	"datetime": "Date",
	"double": "number",
	"integer": "number",
	"boolean": "boolean",
	"string": "string"
}

var determinedTypeToTypescriptTypeConf = {
	"date": "date",
	"datetime": "date",
	"double": "number",
	"integer": "number",
	"boolean": "boolean",
	"string": "string"
}

  module.exports = {
    switchField: switchField,
    determinedTypeToJavaType: determinedTypeToJavaType,
    determinedTypeToTypescriptType: determinedTypeToTypescriptType,
    determinedTypeToTypescriptTypeConf: determinedTypeToTypescriptTypeConf
  };
  

  function isISO8601Date(str) {
    // Regex per una data in formato ISO 8601 con o senza precisione del tempo
    var iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2}\.\d{3})Z)?$/;
  
    // Verifica se la stringa corrisponde alla regex
    if (iso8601Regex.test(str)) {
      // Verifica se la data è valida
      var date = new Date(str);
      if (date.toString() === "Invalid Date") {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  function hasDot(str) {
    const regex = /\./g;
    return regex.test(str);
  }
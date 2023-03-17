function switchField(field) {
  try{
   var datatest = new Date(field);
   var giornotest = datatest.getDate();
    return field.length < 10 ? 'date' : 'datetime';
  }catch(e){
    var temp = typeof field;
    if(temp == 'number'){
      return temp.includes('.') ? 'double' : 'integer';
    }else if (temp == 'boolean'){
      return 'boolean';
    }
    return 'string';
  }
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
  
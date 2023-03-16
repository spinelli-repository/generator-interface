function switchFieldFE(field) {
    switch(field) {
      case 'date':
        return 'Date';
        break;
      case 'int':
        return 'number';
        break;
      case 'double':
        return 'number';
        break;
      case 'string':
        return 'string';
        break;
      case 'boolean':
        return 'boolean';
        break;
      default:
        return 'string';
        break;
    }
  }

  function switchFieldBE(field) {
    switch(field) {
      case 'date':
        return 'LocalDateTime';
        break;
      case 'int':
        return 'BigInteger';
        break;
      case 'double':
        return 'BigDecimal';
        break;
      case 'string':
        return 'String';
        break;
      case 'boolean':
        return 'Boolean';
        break;
      default:
        return 'String';
        break;
    }
  }

  module.exports = {
    switchFieldFE: switchFieldFE,
    switchFieldBE: switchFieldBE
  };
  
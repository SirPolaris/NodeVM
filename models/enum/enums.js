/**
 /**
  * This allows enums to be passed around where needed
  */

var enums = {
    OS_ENUM : {
        WIN7 : 'WIN7',
        WIN10 : 'WIN10',
        WIN_SERVER2012 : 'SERVER2012',
        WIN_SERVER2016 : 'SERVER2016',
    },
    SQL_ENUM: {
        SQL_2012 : 'SQL2012',
        SQL_2016 : 'SQL2016',
    },
    TYPE_ENUM: {
        ISO : 'ISO',
        EXE : 'EXE',
        MSI : 'MSI',
    }
};

module.exports = enums;
/**
 * This will be called on start. It will seed the database if the content is missing.
 * Its built as an array of "new models" that will be iterated over to save each one once the DB is active.
 * 
 * Later we can do a "JSON reader that just reads in the block, and feeds it to "new application"
 * For each "app in directory", read well known text, make app model and save
 * 
 * The above would use the readsync from app.js
 */
const Enums = require("../enum/enums");
const Application = require("../application");

const ArrayOfApps = [

  new Application({
    display_name: "java 7",
    group: 'JAVA',
    version: '7',
    type: Enums.TYPE_ENUM.EXE,
    location_in_repo: "java/java7.exe",
    install_string: "MSI -e -d poop -m and all that",
    uninstall_string: "MSI -e -d poop -m and all that",
    compatibility: {
      os_type: [
        Enums.OS_ENUM.WIN10,
        Enums.OS_ENUM.WIN7,
        Enums.OS_ENUM.WIN_SERVER2012,
        Enums.OS_ENUM.WIN_SERVER2016,
      ],
      sql_type: [
          Enums.SQL_ENUM.SQL_2016, 
          Enums.SQL_ENUM.SQL_2012
      ],
    },
  }),

  new Application({
    display_name: "java 8",
    group: 'JAVA',
    version: '8',
    type: Enums.TYPE_ENUM.EXE,
    location_in_repo: "java/java8.exe",
    install_string: "MSI -e -d poop -m and all that",
    uninstall_string: "MSI -e -d poop -m and all that",
    compatibility: {
      os_type: [
        Enums.OS_ENUM.WIN10,
        Enums.OS_ENUM.WIN7,
        Enums.OS_ENUM.WIN_SERVER2012,
        Enums.OS_ENUM.WIN_SERVER2016,
      ],
      sql_type: [
          Enums.SQL_ENUM.SQL_2016, 
          Enums.SQL_ENUM.SQL_2012
      ],
    },
  }),


];

const ArrayOfCIS = [

    new Application({
      display_name: "CSD 7.0.0.1",
      group: 'CSD',
      version: '7.0.0.1',
      type: Enums.TYPE_ENUM.ISO,
      location_in_repo: "CSD/CSD7.0.0.0_01.iso",
      install_string: "MSI -e -d poop -m and all that",
      uninstall_string: "MSI -e -d poop -m and all that",
      compatibility: {
        os_type: [
          Enums.OS_ENUM.WIN10,
          Enums.OS_ENUM.WIN7,
          Enums.OS_ENUM.WIN_SERVER2012,
          Enums.OS_ENUM.WIN_SERVER2016,
        ],
        sql_type: [
            Enums.SQL_ENUM.SQL_2016, 
            Enums.SQL_ENUM.SQL_2012],
      },
    }),
  
  ];

// For each. Save, wait for result and print to console

ArrayOfApps.forEach(async (val)=>{
    let valReturn = val.save();
    console.log(valReturn);
});

ArrayOfCIS.forEach(async (val)=>{
    let valReturn = val.save();
    console.log(valReturn);
});
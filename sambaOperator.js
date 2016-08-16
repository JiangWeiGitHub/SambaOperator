const fs = require('fs');

function defaultSambaConfig()
{
  let defaultSambaConfig = 
  {
    "global":
    {
      "dns proxy":"no",
      "log file":"/var/log/samba/log.%m",
      "max log size":"1000",
      "syslog":"0",
      "server role":"standalone server",
      "panic action":"/usr/share/samba/panic-action %d",
      "passdb backend":"tdbsam",
      "obey pam restrictions":"yes",
      "unix password sync":"yes",
      "passwd program":"/usr/bin/passwd %u",
      "pam password change":"yes",
      "security":"user",
      "guest account":"nobody",
      "public":"yes"
    },
    "homeFolder":
    {
      "comment":"Home Directory",
      "browseable":"no",
      "read only":"no",
      "create mask":"0775",
      "directory mask":"0775",
      "valid users":"%S"
    },
    "shareFolder":
    {
      "force user":"admin",
      "create mask":"0644",
      "directory mask":"0755"
    }    
  }

  return defaultSambaConfig
}

function checkEssentialInput(inputJson, error)
{
  if( typeof(inputJson.operateType) != String
  || typeof(inputJson.folderName) != String
  || typeof(inputJson.comment) != String
  || typeof(inputJson.folderPath) != String
  || typeof(inputJson.folderShowSwtich) != String
  || typeof(inputJson.defaultUser) != String
  || typeof(inputJson.defaultGroup) != String
  || typeof(inputJson.validUserList) != String
  || typeof(inputJson.writeUserList) != String
}

let test = defaultSambaConfig()
console.log(test.home)

function sambaOperator(inputJson, error)
{
  if(inputJson.operateType
  && inputJson.folderName
  && inputJson.comment
  && inputJson.folderPath
  && inputJson.folderShowSwtich
  && inputJson.defaultUser
  && inputJson.defaultGroup
  && inputJson.validUserList
  && inputJson.writeUserList)
  {
    let inputValue = JSON.stringify(inputJson)
    console.log(inputValue.operateType)
  }
  else
  {
  
  }


}

let testSample = 
{
  "operateType":"group_rw_group_ro",
  "folderName":"hello",
  "comment":"This is just a testing text.",
  "folderPath":"/etc/tmp/hello",
  "folderShowSwtich":"on",
  "defaultUser":"admin",
  "defaultGroup":"aaa",
  "validUserList":
  [
    "aaa",
    "bbb",
    "ccc"
  ],
  "writeUserList":
  [
    "aaa",
    "bbb",
    "ccc"
  ]
}

sambaOperator(testSample)

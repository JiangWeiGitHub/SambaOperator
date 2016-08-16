const fs = require('fs');

let sambaConfigPath = "/etc/samba/smb.config"

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
    "homesFolder":
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

function checkInputFormat(inputJson)
{
  if(typeof(inputJson.workgroup) != 'string'
  || typeof(inputJson['netbios name']) != 'string'
  || typeof(inputJson['server string']) != 'string'
  || typeof(inputJson['map to guest']) != 'string'
  || typeof(inputJson.operateType) != 'string'
  || typeof(inputJson.folderName) != 'string'
  || typeof(inputJson.comment) != 'string'
  || typeof(inputJson.path) != 'string'
  || typeof(inputJson.available) != 'string'
//  || typeof(inputJson['force users']) != 'string'
  || typeof(inputJson['force group']) != 'string'
  || (typeof(inputJson['valid users']) != 'object' && typeof(inputJson['valid users']) != 'string')
  || (typeof(inputJson['write list']) != 'object' && typeof(inputJson['write list']) != 'string'))
  {
    return false
  }
  else
  {
    return true
  }
}

function writeSambaConfig(inputJson)
{
  let tmpConfigStringTree = new String

  if (checkInputFormat(inputJson))
  {
    let tmpSambaConfig = defaultSambaConfig()
    tmpGlobalConfig = tmpSambaConfig.global
    tmpHomesConfig = tmpSambaConfig.homesFolder
    tmpShareFolderConfig = tmpSambaConfig.shareFolder

    tmpGlobalConfig.workgroup = inputJson.workgroup
    tmpGlobalConfig['netbios name'] = inputJson['netbios name']
    tmpGlobalConfig['server string'] = inputJson['server string']
    tmpGlobalConfig['map to guest'] = inputJson['map to guest']

    tmpConfigStringTree = tmpConfigStringTree.concat("[global]\n")
    for (let prop in tmpGlobalConfig)
    {
      tmpConfigStringTree = tmpConfigStringTree.concat(
      prop + " = " + tmpGlobalConfig[prop] + "\n")
    }

    tmpConfigStringTree = tmpConfigStringTree.concat("\n[homes]\n")
    for (let prop in tmpHomesConfig)
    {
      tmpConfigStringTree = tmpConfigStringTree.concat(
      prop + " = " + tmpHomesConfig[prop] + "\n")
    }

    if(inputJson.operateType === "group_rw_group_ro")
    {
      tmpConfigStringTree = tmpConfigStringTree.concat("\n[" + inputJson.folderName + "]\n")

      tmpShareFolderConfig['comment'] = inputJson['comment']
      tmpShareFolderConfig['path'] = inputJson['path']
      tmpShareFolderConfig['available'] = inputJson['available']
      tmpShareFolderConfig['force group'] = inputJson['force group']
      tmpShareFolderConfig['valid users'] = inputJson['valid users']
      tmpShareFolderConfig['write list'] = inputJson['write list']

      for (let prop in tmpShareFolderConfig)
      {
        if(typeof(tmpShareFolderConfig[prop]) === 'string')
        {
          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpString + "\n")
        }
      }
    }
    else if(inputJson.operateType === "group_rw_other_ro_with_guest")
    {
      tmpConfigStringTree = tmpConfigStringTree.concat("\n[" + inputJson.folderName + "]\n")

      tmpShareFolderConfig['comment'] = inputJson['comment']
      tmpShareFolderConfig['path'] = inputJson['path']
      tmpShareFolderConfig['available'] = inputJson['available']
      tmpShareFolderConfig['force group'] = inputJson['force group']
      tmpShareFolderConfig['valid users'] = inputJson['valid users']
      tmpShareFolderConfig['write list'] = inputJson['write list']

      for (let prop in tmpShareFolderConfig)
      {
        if(typeof(tmpShareFolderConfig[prop]) === 'string')
        {
          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special parameters
      tmpConfigStringTree = tmpConfigStringTree.concat("read only = no\n")
      tmpConfigStringTree = tmpConfigStringTree.concat("guest ok = yes\n")
    }
    else if(inputJson.operateType === "group_rw_other_ro_without_guest")
    {
      tmpConfigStringTree = tmpConfigStringTree.concat("\n[" + inputJson.folderName + "]\n")

      tmpShareFolderConfig['comment'] = inputJson['comment']
      tmpShareFolderConfig['path'] = inputJson['path']
      tmpShareFolderConfig['available'] = inputJson['available']
      tmpShareFolderConfig['force group'] = inputJson['force group']
//    tmpShareFolderConfig['valid users'] = inputJson['valid users']
      tmpShareFolderConfig['write list'] = inputJson['write list']

      for (let prop in tmpShareFolderConfig)
      {
        if(typeof(tmpShareFolderConfig[prop]) === 'string')
        {
          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special operate
      tmpShareFolderConfig['valid users'] = "+users"
    }
    else if(inputJson.operateType === "world_rw_with_guest")
    {
      tmpConfigStringTree = tmpConfigStringTree.concat("\n[" + inputJson.folderName + "]\n")

      tmpShareFolderConfig['comment'] = inputJson['comment']
      tmpShareFolderConfig['path'] = inputJson['path']
      tmpShareFolderConfig['available'] = inputJson['available']
      tmpShareFolderConfig['force group'] = inputJson['force group']
      tmpShareFolderConfig['valid users'] = inputJson['valid users']
      tmpShareFolderConfig['write list'] = inputJson['write list']

      for (let prop in tmpShareFolderConfig)
      {
        if(typeof(tmpShareFolderConfig[prop]) === 'string')
        {
          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special parameters
      tmpConfigStringTree = tmpConfigStringTree.concat("read only = no\n")
      tmpConfigStringTree = tmpConfigStringTree.concat("guest ok = yes\n")
    }
    else if(inputJson.operateType === "world_rw_without_guest")
    {
      tmpConfigStringTree = tmpConfigStringTree.concat("\n[" + inputJson.folderName + "]\n")

      tmpShareFolderConfig['comment'] = inputJson['comment']
      tmpShareFolderConfig['path'] = inputJson['path']
      tmpShareFolderConfig['available'] = inputJson['available']
      tmpShareFolderConfig['force group'] = inputJson['force group']
      tmpShareFolderConfig['valid users'] = inputJson['valid users']
//    tmpShareFolderConfig['write list'] = inputJson['write list']

      for (let prop in tmpShareFolderConfig)
      {
        if(typeof(tmpShareFolderConfig[prop]) === 'string')
        {
          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigStringTree = tmpConfigStringTree.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special operate
      tmpShareFolderConfig['write list'] = "+users"
    }
    else
    {
      return false
    }

console.log(tmpConfigStringTree)

  }
  else
  {
    return false
  }
}

let testSample =
{
  "workgroup":"WORKGROUP",
  "netbios name":"NETBIOS",
  "server string":"SERVERNAME",
  "map to guest":"Bad User",
  "operateType":"group_rw_group_ro",
  "folderName":"hello",
  "comment":"This is just a testing text.",
  "path":"/etc/tmp/hello",
  "available":"on",
//  "force users":"admin",
  "force group":"aaa",
  "valid users":
  [
    "aaa",
    "bbb",
    "ccc"
  ],
  "write list":
  [
    "aaa",
    "bbb",
    "ccc"
  ]
}

writeSambaConfig(testSample)

//export
//{
//  writeSambaConfig
//}

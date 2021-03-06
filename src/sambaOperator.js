const fs = require('fs')

let sambaConfigPath = {
  value: ''
}

let error = new Error('Write File Failed.');

function setSambaConfigPath(inputPath)
{
  sambaConfigPath.value = inputPath
  return
}

function getSambaConfigPath()
{
  return sambaConfigPath.value
}

function checkNodeEnv()
{
  if(process.env.mode === 'test')
  {
    setSambaConfigPath("./smb_test.config")
    return
  }
  else if(process.env.mode === 'product')
  {
    setSambaConfigPath("/etc/samba/smb.config")
    return
  }
  else
  {
    return false
  }
}

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

function createSambaConfig(inputJson)
{
  let tmpConfigString = new String

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

    tmpConfigString = tmpConfigString.concat("[global]\n")
    for (let prop in tmpGlobalConfig)
    {
      tmpConfigString = tmpConfigString.concat(
      prop + " = " + tmpGlobalConfig[prop] + "\n")
    }

    tmpConfigString = tmpConfigString.concat("\n[homes]\n")
    for (let prop in tmpHomesConfig)
    {
      tmpConfigString = tmpConfigString.concat(
      prop + " = " + tmpHomesConfig[prop] + "\n")
    }

    if(inputJson.operateType === "group_rw_group_ro")
    {
      tmpConfigString = tmpConfigString.concat("\n[" + inputJson.folderName + "]\n")

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
          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else //if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpString + "\n")
        }
      }
    }
    else if(inputJson.operateType === "group_rw_other_ro_with_guest")
    {
      tmpConfigString = tmpConfigString.concat("\n[" + inputJson.folderName + "]\n")

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
          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else //if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special parameters
      tmpConfigString = tmpConfigString.concat("read only = no\n")
      tmpConfigString = tmpConfigString.concat("guest ok = yes\n")
    }
    else if(inputJson.operateType === "group_rw_other_ro_without_guest")
    {
      tmpConfigString = tmpConfigString.concat("\n[" + inputJson.folderName + "]\n")

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
          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else //if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special operate
      tmpConfigString = tmpConfigString.concat("valid users = +users\n")
    }
    else if(inputJson.operateType === "world_rw_with_guest")
    {
      tmpConfigString = tmpConfigString.concat("\n[" + inputJson.folderName + "]\n")

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
          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else //if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special parameters
      tmpConfigString = tmpConfigString.concat("read only = no\n")
      tmpConfigString = tmpConfigString.concat("guest ok = yes\n")
    }
    else if(inputJson.operateType === "world_rw_without_guest")
    {
      tmpConfigString = tmpConfigString.concat("\n[" + inputJson.folderName + "]\n")

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
          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpShareFolderConfig[prop] + "\n")
        }
        else //if(typeof(tmpShareFolderConfig[prop]) === 'object')
        {
          let tmpString = new String

          for (let subprop in tmpShareFolderConfig[prop])
          {
            tmpString = tmpString.concat('+' + tmpShareFolderConfig[prop][subprop] + ' ')
          }

          tmpConfigString = tmpConfigString.concat(
          prop + " = " + tmpString + "\n")
        }
      }

      // Special operate
      tmpConfigString = tmpConfigString.concat("write list = +users\n")
    }
    else
    {
      return false
    }

    return tmpConfigString

  }
  else
  {
    return false
  }
}

function writeSambaConfig(inputJson)
{
  let checkEnv = checkNodeEnv()
  if(checkEnv === false)
  {
    return false
  }

  let sambaConfig = createSambaConfig(inputJson)
  if(sambaConfig === false)
  {
    return false
  }
  else
  {
    try
    {
      fs.writeFileSync(sambaConfigPath.value, sambaConfig, 'utf8')
    }
    catch(err)
    {
      throw error
    }

    return true
  }
}

module.exports =
{
  sambaConfigPath: sambaConfigPath,
  error: error,
  setSambaConfigPath: setSambaConfigPath,
  getSambaConfigPath: getSambaConfigPath,
  checkNodeEnv: checkNodeEnv,
  defaultSambaConfig: defaultSambaConfig,
  checkInputFormat: checkInputFormat,
  createSambaConfig: createSambaConfig,
  writeSambaConfig: writeSambaConfig
}

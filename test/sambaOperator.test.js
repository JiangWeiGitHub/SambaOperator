const fs = require('fs')

let testEntity = require('../src/sambaOperator')

let expect = require('chai').expect
let sinon = require('sinon')

describe('Check \'setSambaConfigPath\' Function', function() {

  beforeEach(function(){
    testEntity.sambaConfigPath.value = ''
  })

  it('Should return \'undefined\' if the given path\'s format is vailid', function() {
    expect(testEntity.setSambaConfigPath('/home/test/haha.txt')).to.be.eql(undefined)
  })

  it('Should return \'undefined\' if the given path\'s format is \'undefined\'', function() {
    expect(testEntity.setSambaConfigPath(undefined)).to.be.eql(undefined)
  })

  it('Should return \'undefined\' if the given path\'s format is \'\'', function() {
    expect(testEntity.setSambaConfigPath('')).to.be.eql(undefined)
  })

  it('\'sambaConfigPath.value\' would be \'./haha.txt\' if the given path is \'./haha.txt\'', function() {
    testEntity.setSambaConfigPath('./haha.txt')
    expect(testEntity.sambaConfigPath.value).to.be.eql('./haha.txt')
  })

  it('\'sambaConfigPath.value\' would be \'undefined\' if the given path is \'undefined\'', function() {
    testEntity.setSambaConfigPath(undefined)
    expect(testEntity.sambaConfigPath.value).to.be.eql(undefined)
  })

  it('\'sambaConfigPath.value\' would be \'\' if the given path is \'\'', function() {
    testEntity.setSambaConfigPath('')
    expect(testEntity.sambaConfigPath.value).to.be.eql('')
  })
})

describe('Check \'getSambaConfigPath\' Function', function() {

  beforeEach(function(){
    testEntity.sambaConfigPath.value = ''
  })

  it('Should get \'/home/test/smb.conf\' if the given path is \'/home/test/smb.conf\'', function() {
    testEntity.sambaConfigPath.value = '/home/test/smb.conf'
    expect(testEntity.getSambaConfigPath()).to.be.eql('/home/test/smb.conf')
  })

  it('Should get \'\' if the given path is \'\'', function() {
    testEntity.sambaConfigPath.value = ''
    expect(testEntity.getSambaConfigPath()).to.be.eql('')
  })

  it('Should get \'undefined\' if the given path is \'undefined\'', function() {
    testEntity.sambaConfigPath.value = undefined
    expect(testEntity.getSambaConfigPath()).to.be.eql(undefined)
  })
})

describe('Check \'checkNodeEnv\' Function', function() {

  beforeEach(function(){
    process.env.mode = ''
  })

  it('Should get \'false\' if the \'process.env.mode\' is \'\'', function() {
    process.env.mode = ''
    expect(testEntity.checkNodeEnv()).to.be.not.ok
  })

  it('Should get \'undefined\' if the \'process.env.mode\' is \'test\'', function() {
    process.env.mode = 'test'
    expect(testEntity.checkNodeEnv()).to.be.eql(undefined)
  })

  it('Should get \'undefined\' if the \'process.env.mode\' is \'product\'', function() {
    process.env.mode = 'product'
    expect(testEntity.checkNodeEnv()).to.be.eql(undefined)
  })

  it('\'sambaConfigPath.value\' should be \'./smb_test.config\' if the \'process.env.mode\' is \'test\'', function() {
    process.env.mode = 'test'
    testEntity.checkNodeEnv()
    expect(testEntity.getSambaConfigPath()).to.be.eql('./smb_test.config')
  })

  it('\'sambaConfigPath.value\' should be \'/etc/samba/smb.config\' if the \'process.env.mode\' is \'product\'', function() {
    process.env.mode = 'product'
    testEntity.checkNodeEnv()
    expect(testEntity.getSambaConfigPath()).to.be.eql('/etc/samba/smb.config')
  })
})

describe('Check \'defaultSambaConfig\' Function', function() {

  it('Should get \'defaultSambaConfig\' object', function() {
    expect(testEntity.defaultSambaConfig()['global']['dns proxy']).to.be.eql('no')
    expect(testEntity.defaultSambaConfig()['global']['log file']).to.be.eql('/var/log/samba/log.%m')
    expect(testEntity.defaultSambaConfig()['global']['public']).to.be.eql('yes')

    expect(testEntity.defaultSambaConfig()['homesFolder']['comment']).to.be.eql('Home Directory')
    expect(testEntity.defaultSambaConfig()['homesFolder']['valid users']).to.be.eql('%S')

    expect(testEntity.defaultSambaConfig()['shareFolder']['force user']).to.be.eql('admin')
    expect(testEntity.defaultSambaConfig()['shareFolder']['directory mask']).to.be.eql('0755')
  })
})

describe('Check \'checkInputFormat\' Function', function() {

  beforeEach( function() {
    testSample =
    {
      "workgroup":"WORKGROUP",
      "netbios name":"NETBIOS",
      "server string":"SERVERNAME",
      "map to guest":"Bad User",
      "operateType":"world_rw_without_guest",
      "folderName":"hello",
      "comment":"This is just a testing text.",
      "path":"/etc/tmp/hello",
      "available":"on",
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
  })

  it('Should get \'true\' if \'inputJson\'\'s format is valid', function() {
    expect(testEntity.checkInputFormat(testSample)).to.be.ok
  })

  it('Should get \'false\' if \'inputJson\'\'s \'workgroup\'\'s content is \'key\':\'value\'', function() {
    testSample['workgroup'] = {'key':'value'}
    expect(testEntity.checkInputFormat(testSample)).to.be.not.ok
  })

  it('Should get \'false\' if \'inputJson\'\'s \'netbios name\'\'s content is \'key\':\'value\'', function() {
    testSample['netbios name'] = {'key':'value'}
    expect(testEntity.checkInputFormat(testSample)).to.be.not.ok
  })

  it('Should get \'false\' if \'inputJson\'\'s \'valid users\'\'s content is \'123\'', function() {
    testSample['valid users'].pop()
    testSample['valid users'].pop()
    testSample['valid users'].pop()
    testSample['valid users'] = 123
    expect(testEntity.checkInputFormat(testSample)).to.be.not.ok
  })

  it('Should get \'true\' if \'inputJson\'\'s \'valid users\'\'s content is \'aaa\'', function() {
    testSample['valid users'].pop()
    testSample['valid users'].pop()
    expect(testEntity.checkInputFormat(testSample)).to.be.ok
  })

  it('Should get \'true\' if \'inputJson\'\'s \'write list\'\'s content is \'aaa\'', function() {
    testSample['write list'].pop()
    testSample['write list'].pop()
    expect(testEntity.checkInputFormat(testSample)).to.be.ok
  })
})

describe('Check \'createSambaConfig\' Function', function() {

  beforeEach( function() {
    testSample =
    {
      "workgroup":"WORKGROUP",
      "netbios name":"NETBIOS",
      "server string":"SERVERNAME",
      "map to guest":"Bad User",
      "operateType":"world_rw_without_guest",
      "folderName":"hello",
      "comment":"This is just a testing text.",
      "path":"/etc/tmp/hello",
      "available":"on",
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
  })

  it('Should get \'true\' if \'inputJson\'\'s \'operateType\' is \'group_rw_group_ro\'', function() {
    testSample['operateType'] = 'group_rw_group_ro'
    expect(testEntity.createSambaConfig(testSample)).to.be.ok
  })

  it('Should get \'true\' if \'inputJson\'\'s \'operateType\' is \'group_rw_other_ro_with_guest\'', function() {
    testSample['operateType'] = 'group_rw_other_ro_with_guest'
    expect(testEntity.createSambaConfig(testSample)).to.be.ok
  })

  it('Should get \'read only = no & guest ok = yes\' if \'inputJson\'\'s \'operateType\' is \'group_rw_other_ro_with_guest\'', function() {
    testSample['operateType'] = 'group_rw_other_ro_with_guest'
    expect(testEntity.createSambaConfig(testSample).indexOf('read only = no')).to.be.not.eql(-1)
    expect(testEntity.createSambaConfig(testSample).indexOf('guest ok = yes')).to.be.not.eql(-1)
  })

  it('Should get \'true\' if \'inputJson\'\'s \'operateType\' is \'group_rw_other_ro_without_guest\'', function() {
    testSample['operateType'] = 'group_rw_other_ro_without_guest'
    expect(testEntity.createSambaConfig(testSample)).to.be.ok
  })

  it('Should get \'valid users = +users\' if \'inputJson\'\'s \'operateType\' is \'group_rw_other_ro_without_guest\'', function() {
    testSample['operateType'] = 'group_rw_other_ro_without_guest'
    expect(testEntity.createSambaConfig(testSample).indexOf('valid users = +users')).to.be.not.eql(-1)
  })

  it('Should get \'true\' if \'inputJson\'\'s \'operateType\' is \'world_rw_with_guest\'', function() {
    testSample['operateType'] = 'world_rw_with_guest'
    expect(testEntity.createSambaConfig(testSample)).to.be.ok
  })

  it('Should get \'read only = no & guest ok = yes\' if \'inputJson\'\'s \'operateType\' is \'world_rw_with_guest\'', function() {
    testSample['operateType'] = 'world_rw_with_guest'
    expect(testEntity.createSambaConfig(testSample).indexOf('read only = no')).to.be.not.eql(-1)
    expect(testEntity.createSambaConfig(testSample).indexOf('guest ok = yes')).to.be.not.eql(-1)
  })

  it('Should get \'true\' if \'inputJson\'\'s \'operateType\' is \'world_rw_without_guest\'', function() {
    testSample['operateType'] = 'world_rw_without_guest'
    expect(testEntity.createSambaConfig(testSample)).to.be.ok
  })

  it('Should get \'write list = +users\' if \'inputJson\'\'s \'operateType\' is \'world_rw_without_guest\'', function() {
    testSample['operateType'] = 'world_rw_without_guest'
    expect(testEntity.createSambaConfig(testSample).indexOf('write list = +users')).to.be.not.eql(-1)
  })

  it('Should get \'false\' if \'inputJson\'\'s \'operateType\' is \'abc\'', function() {
    testSample['operateType'] = 'abc'
    expect(testEntity.createSambaConfig(testSample)).to.be.not.ok
  })

  it('Should get \'false\' if \'inputJson\'\'s format is invalid', function() {
    testSample['operateType'] = undefined
    expect(testEntity.createSambaConfig(testSample)).to.be.not.ok
  })

  it('Should get \'true\' if \'inputJson\'\'s \'valid users\' is \'string\'', function() {
    testSample['valid users'].pop()
    testSample['valid users'].pop()
    expect(testEntity.createSambaConfig(testSample)).to.be.ok
  })
})

describe('Check \'writeSambaConfig\' Function', function() {

  beforeEach( function() {

    process.env.mode = 'test'

    testSample =
    {
      "workgroup":"WORKGROUP",
      "netbios name":"NETBIOS",
      "server string":"SERVERNAME",
      "map to guest":"Bad User",
      "operateType":"world_rw_without_guest",
      "folderName":"hello",
      "comment":"This is just a testing text.",
      "path":"/etc/tmp/hello",
      "available":"on",
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
  })

  it('Should get \'false\' if \'inputJson\'\'s format is invalid', function() {
    testSample['operateType'] = undefined
    expect(testEntity.writeSambaConfig(testSample)).to.be.not.ok
  })

  it('Should get \'true\' if \'inputJson\'\'s format is valid', function() {
    expect(testEntity.writeSambaConfig(testSample)).to.be.ok
  })

  it('Should get \'false\' if \'process.env.mode\'\'s format is invalid', function() {
    process.env.mode = undefined
    expect(testEntity.writeSambaConfig(testSample)).to.be.not.ok
  })

  it('Should get \'true\' if \'process.env.mode\'\'s format is valid', function() {
    expect(testEntity.writeSambaConfig(testSample)).to.be.ok
  })

  it('Should get throw error if stub \'writeFileSync\' function with throw error', function() {

    let write = sinon.stub(fs, 'writeFileSync', function(){
      throw testEntity.error
    })

    expect(function(){testEntity.writeSambaConfig(testSample)}).to.throw(testEntity.error)

    fs.writeFileSync.restore()
  })
})

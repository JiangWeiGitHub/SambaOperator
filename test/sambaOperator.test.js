const fs = require('fs')

let testEntity = require('../src/sambaOperator')

let expect = require('chai').expect

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

  it('Should get \'false\' if \'inputJson\'\'s format is invalid', function() {
    testSample['workgroup'] = {'key':'value'}
    expect(testEntity.checkInputFormat(testSample)).to.be.not.ok
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

  it('Should get \'false\' if \'inputJson\'\'s format is invalid', function() {
    testSample['workgroup'] = {'key':'value'}
    expect(testEntity.checkInputFormat(testSample)).to.be.not.ok
  })


})

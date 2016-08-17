let defaultSambaConfig = require('../src/sambaOperator.js').defaultSambaConfig
let checkInputFormat = require('../src/sambaOperator.js').checkInputFormat
let createSambaConfig = require('../src/sambaOperator.js').createSambaConfig
let writeSambaConfig = require('../src/sambaOperator.js').writeSambaConfig

let expect = require('chai').expect

describe('Test Write Samba Configure File Method', function() {

  let testSample = new Object

  beforeEach(function(){

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

  it('Check \'defaultSambaConfig\' Function', function() {
    let tmpData = defaultSambaConfig()
    expect(tmpData).to.include.keys('global')
    expect(tmpData.global).to.include.keys('dns proxy')
    expect(tmpData.global).to.include.keys('log file')
    expect(tmpData.global).to.include.keys('max log size')
    expect(tmpData.global).to.include.keys('syslog')
    expect(tmpData.global).to.include.keys('server role')
    expect(tmpData.global).to.include.keys('panic action');
    expect(tmpData.global).to.include.keys('passdb backend')
    expect(tmpData.global).to.include.keys('obey pam restrictions')
    expect(tmpData.global).to.include.keys('unix password sync')
    expect(tmpData.global).to.include.keys('passwd program')
    expect(tmpData.global).to.include.keys('pam password change')
    expect(tmpData.global).to.include.keys('security')
    expect(tmpData.global).to.include.keys('guest account')
    expect(tmpData.global).to.include.keys('public')

    expect(tmpData).to.include.keys('homesFolder')
    expect(tmpData.homesFolder).to.include.keys('comment')
    expect(tmpData.homesFolder).to.include.keys('browseable')
    expect(tmpData.homesFolder).to.include.keys('read only')
    expect(tmpData.homesFolder).to.include.keys('create mask')
    expect(tmpData.homesFolder).to.include.keys('directory mask')
    expect(tmpData.homesFolder).to.include.keys('valid users')

    expect(tmpData).to.include.keys('shareFolder')
    expect(tmpData.shareFolder).to.include.keys('force user')
    expect(tmpData.shareFolder).to.include.keys('create mask')
    expect(tmpData.shareFolder).to.include.keys('directory mask')
  })

  it('Check \'checkInputFormat\' Function', function() {
    expect(checkInputFormat(testSample)).to.be.ok
    testSample['map to guest'] = false
    expect(checkInputFormat(testSample)).to.not.be.ok
    delete testSample['valid users']
    expect(checkInputFormat(testSample)).to.not.be.ok
  });

  it('Check \'createSambaConfig\' Function', function() {
    expect(createSambaConfig(testSample).indexOf('valid users = +aaa +bbb +ccc')).to.be.not.equal(-1)
    expect(createSambaConfig(testSample).indexOf('available = hello')).to.be.equal(-1)
  });

  it('Check \'writeSambaConfig\' Function', function() {
    let tmpResult = createSambaConfig(testSample)
    expect(writeSambaConfig(tmpResult)).to.be.ok
  });
});

let defaultSambaConfig = require('../sambaOperator.js').defaultSambaConfig
let checkInputFormat = require('../sambaOperator.js').checkInputFormat


let expect = require('chai').expect

describe('Test Write Samba Configure File Method', function() {
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

let testSample =
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

    expect(checkInputFormat(testSample)).to.be.ok
  });

});

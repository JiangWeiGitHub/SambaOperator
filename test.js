let testSambaConfig = require('./sambaOperator.js')

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

let result = testSambaConfig.writeSambaConfig(testSample)
console.log("Result: " + result)

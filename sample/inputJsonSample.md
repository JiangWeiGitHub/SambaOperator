### Input JSON Sample

[Official Site](https://www.samba.org/samba/docs/man/manpages/smb.conf.5.html)

```
{
  "workgroup":"WORKGROUP",
  "netbios name":"NETBIOS",
  "server string":"SERVERNAME",
  "map to guest":"Bad User",
  "operateType":"group_rw_group_ro",
  "folderName":"hello",
  "comment":"This is just a testing text.",
  "Path":"/etc/tmp/hello",
  "available":"on",
  "force user":"admin",
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
```

##### Value of operateType

```
  # All users & groups can not access this folder except that some specified groups can rw & some specified groups can ro
  1. group_rw_group_ro
  
  # All users & groups can ro to this folder except that some specified groups can rw
  2. group_rw_other_ro_with_guest
  
  # All registered users & groups can ro to this folder except that some specified groups can rw, and guest can not access to this folder
  3. group_rw_other_ro_without_guest
  
  # All users & groups can rw
  4. world_rw_with_guest
  
  # All users & groups can rw except guest
  5. world_rw_without_guest
```

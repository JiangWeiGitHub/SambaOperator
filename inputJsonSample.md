### Input JSON Sample

[Official Site](https://www.samba.org/samba/docs/man/manpages/smb.conf.5.html)

```
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
```

### Value of operateType
  1. group_rw_group_ro
  2. group_rw_other_ro_with_guest
  3. group_rw_other_ro_without_guest
  4. world_rw_with_guest
  5. world_rw_without_guest


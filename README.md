# uuid-v8
An experimental implementation of the proposed UUID Version 8


### Default
```javascript
import { uuidv8 } from "uuid-v8";

const result = uuidv8(); // e.g., "07e70c15-0f38-8bfc-ba65-f0ec85dc2812"
```
    (or)

```javascript
const { uuidv8 } = require("uuid-v8")

const result = uuidv8(); // e.g., "07e70c15-0f38-8bfc-ba65-f0ec85dc2812"
```




### with custom time
```javascript
import { UUID } from "uuid-v8";

//current Time
const uuid1 = UUID.generate(); // e.g., "07e70c16-0631-870e-0316-e51b1fab5ebb"

//Generate for a given time
var t = new Date()
const uuid2 = UUID.generate({time:t}); 
```

### Get time associated with the UUID
```javascript
import { UUID } from "uuid-v8";

//Gets the time associated with the UUID
const date = UUID.getTime('07e70c16-0631-870e-0316-e51b1fab5ebb'); 

```

### Parse the UUID to Bytes
```javascript
import { UUID } from "uuid-v8";

//Gets the time associated with the UUID
const bytes = UUID.parse('07e70c16-0631-870e-0316-e51b1fab5ebb'); 

const bytesInHex = UUID.parseToHex('07e70c16-0631-870e-0316-e51b1fab5ebb'); 

```


### Command-line interface:

```bash
$ npx uuid-v8
07e70c16-0637-8003-0139-e65bfe87ae09
$
$ npx uuid-v8 -n 4
07e70c16-0637-8e13-0085-98ded92d312c
07e70c16-0637-8713-0087-558d00e6ffa1
07e70c16-0637-8e13-0087-8deb1113ab9e
07e70c16-0637-8313-0088-bdc6ff36d2fc
07e70c16-0637-8713-0088-02fbd0573c85
```

See [draft-ietf-uuidrev-rfc4122bis-11](https://www.ietf.org/archive/id/draft-ietf-uuidrev-rfc4122bis-11.html).

## Field and bit layout

UUID version 8 provides an RFC-compatible format for experimental or vendor-specific use cases. The only requirement is that the variant and version bits MUST be set as defined in Section 4.1 and Section 4.2. UUIDv8's uniqueness will be implementation-specific and MUST NOT be assumed.The only explicitly defined bits are those of the version and variant fields, leaving 122 bits for implementation specific UUIDs. 
To be clear: UUIDv8 is not a replacement for UUIDv4 Section 5.4 where all 122 extra bits are filled with random data.Some example situations in which UUIDv8 usage could occur:
An implementation would like to embed extra information within the UUID other than what is defined in this document.
An implementation has other application/language restrictions which inhibit the use of one of the current UUIDs.

```
 0                   10                  20                  30
 0 1 2 3 4 5 6 7 8 9 A B C D E F 0 1 2 3 4 5 6 7 8 9 A B C D E F
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        year-month-day                         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          hour:minute          |  ver  | rand  |    seconds    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|var| milliseconds  |                   rand                    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             rand                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

## CommonJS support

The CommonJS entry point is deprecated and provided for backward compatibility
purposes only. The entry point is no longer tested and will be removed once this
library hits the stable version number of v1.

## License

Licensed under the Apache License, Version 2.0.



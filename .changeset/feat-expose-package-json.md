---
"routini": minor
---

Expose `package.json` in the `exports` map, so consumers can read the installed
version without hand-maintaining a copy.

```ts
import { version } from "routini/package.json";
```


## Reproduction Steps

We have a basic usage of `AsyncLocalStorage` (see `index.js`):

```javascript
import { AsyncLocalStorage } from "async_hooks";
const asl = new AsyncLocalStorage();

async function pretendDbCall() {
}

async function doWork() {
  return new Promise((resolve) => {
    asl.run({value: "1234"}, async () => {
      console.log(asl.getStore());
      await pretendDbCall();
      console.log(asl.getStore());
      resolve();
    });
  });
}

doWork().then(() => console.log("done"));
```

### Invoked via nodejs directly works

This works in nodejs 16.2.0 when invoked directly (we see `value: 1234` twice):

```
$ node index.js
{ value: '1234' }
{ value: '1234' }
done
```

### Invoked via jest doesn't work

However, when running the same code snippet in (see `index.test.js`) via jest:

```
node --experimental-vm-modules node_modules/.bin/jest
 PASS  ./index.test.js
  asl
    ✓ works (17 ms)

  console.log
    { value: '1234' }

      at index.test.js:13:19

  console.log
    undefined

      at index.test.js:15:19
```

The 2nd `asl.getStore()` returns `undefined`.

### Invoke via jest + `detectOpenHandles` does works

Note that running Jest _and_ `detectOpenHandles` restores the behavior:

```
node --experimental-vm-modules node_modules/.bin/jest --detectOpenHandles
 PASS  ./index.test.js
  asl
    ✓ works (17 ms)

  console.log
    { value: '1234' }

      at index.test.js:13:19

  console.log
    { value: '1234' }

      at index.test.js:15:19
```

## Working vs. Broken Matrix

| Node Version | Invoked Via | Result |
| ------------ | ----------- | ------ |
| 16.1.0       | node        | yes    |
| 16.1.0       | jest        | yes    |
| 16.1.0       | jest + detectOpenHandles | yes |
| 16.2.0       | node        | yes    |
| 16.2.0       | jest        | no     |
| 16.2.0       | jest  + detectOpenHandles | yes |








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

import { AsyncLocalStorage } from "async_hooks";

const asl = new AsyncLocalStorage();

async function pretendDbCall() {
}

describe("asl", () => {
  it("works", async () => {
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
    return doWork();
  });
});

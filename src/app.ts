import express, { Request, Response } from "express";
import { Worker, isMainThread, workerData } from "worker_threads";
import storeRoutes from "./routes/store.route";
import testRoutes from "./routes/test.route";
import { LockFreeQueue } from "./controllers/lockFreeQueue.controller";
import { JobScheduler } from "./services/jobScheduler.service";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const scheduler = new JobScheduler();

const job1 = () => console.log("Executing Job 1: Hello after 2 seconds!");
const job2 = () => console.log("Executing Job 2: Hello after 5 seconds!");

scheduler.schedule('job1', job1, 2000);
scheduler.schedule('job2', job2, 5000);

setTimeout(() => {
  scheduler.cancel('job2');
}, 3000);

app.use("/store", storeRoutes);
app.use("/test", testRoutes);


const queue = new LockFreeQueue<number>();

function handleHeavyTask(): void {
  const worker = new Worker("./dist/controllers/worker.controller.js", {
    workerData: { number: queue.dequeue() },
  });

  worker.on("message", (result) => {
    console.log(`Worker completed the calculation. Result: ${result}`);
  });

  worker.on("error", (error) => {
    console.error("Worker encountered an error:", error);
  });

  worker.on("exit", (exitCode) => {
    if (exitCode !== 0) {
      console.error(`Worker stopped with exit code ${exitCode}`);
    }
  });

  console.log("Worker thread started processing the heavy task...");
}

app.post("/calculate-fibonacci", (req: Request, res: Response) => {
  const { number }: { number: number } = req.body;

  if (typeof number !== "number" || number < 0) {
    res.status(400).send("Please provide a valid non-negative number.");
  }

  queue.enqueue(number);

  handleHeavyTask();

  res.send("Fibonacci calculation is being processed.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
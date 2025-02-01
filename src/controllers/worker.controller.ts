import { parentPort, workerData } from "worker_threads";

const numberToCalculate = workerData.number; 

if (numberToCalculate !== null && numberToCalculate !== undefined) {
  const result = fibonacci(numberToCalculate);
  parentPort?.postMessage(result);
} else {
  parentPort?.postMessage("No task in the queue.");
}

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

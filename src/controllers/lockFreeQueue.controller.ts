class Node<T> {
  value: T;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LockFreeQueue<T> {
  private head: Node<T>;
  private tail: Node<T>;

  constructor() {
    const dummy = new Node<T>(null as unknown as T);
    this.head = dummy;
    this.tail = dummy;
  }

  enqueue(value: T): void {
    const newNode = new Node(value);
    while (true) {
      const last = this.tail;
      if (last.next === null) {
        last.next = newNode;
        this.tail = newNode;
        return;
      }
    }
  }

  dequeue(): T | null {
    while (true) {
      const first = this.head.next;
      if (first === null) {
        return null;
      }
      this.head = first;
      return first.value;
    }
  }
}

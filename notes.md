# JavaScript Event Loop — Detailed Notes (from the screenshot)

This note explains the Event Loop diagram shown in the screenshot and how JavaScript schedules and runs work across the Call Stack, Web APIs, and the two queues (Tasks vs Microtasks).

## 1) What the diagram shows
- Left box:
  - Heap — where objects live (memory).
  - Stack — frames of currently executing functions (synchronous JS runs here).
- Right box (Web APIs):
  - Environment features like `setTimeout`, network (`http_ajax`/fetch/XHR), and DOM event sources.
  - They hold async operations until they complete, then enqueue callbacks.
- Bottom box (Queue):
  - Callback / Tasks = macrotask queue (a.k.a. task queue).
  - Micro Tasks = microtask queue.
- Event Loop (curved arrow):
  - Moves ready callbacks from queues to the Call Stack when the stack is empty, following strict ordering rules.

## 2) Two kinds of queues (and common sources)
- Microtasks (always run to completion before the next macrotask):
  - `Promise.then/catch/finally`
  - `queueMicrotask`
  - `MutationObserver`
  - Node.js: also after each phase; special case: `process.nextTick` runs even before other microtasks in Node (see Node box below).
- Macrotasks (a.k.a. tasks):
  - `setTimeout`, `setInterval`
  - UI events (click, input), message events (`postMessage`), script execution, I/O callbacks
  - Node.js: timers, I/O callbacks, `setImmediate` (in the check phase), etc.

## 3) Core ordering rules (browser)
1. Run-to-completion: JavaScript runs one thing at a time on the Stack. A script or task runs until it finishes; nothing interleaves in the middle.
2. After the current script or macrotask finishes, the engine flushes the entire microtask queue (drains all microtasks). New microtasks queued while flushing are also executed before moving on.
3. Rendering typically happens between tasks, after microtasks are drained (browsers may align paints between tasks).
4. Timers (`setTimeout(fn, 0)`) are not immediate; they’re placed in the task queue and only run once the stack is clear and all microtasks are done, and after minimum clamping.

## 4) Life of an async operation (from the diagram)
1. Synchronous code runs on the Stack.
2. An async API is called (via Web APIs), e.g., `setTimeout`, `fetch`/XHR, DOM listener registration, etc.
3. When the async work completes, its callback is queued:
   - Promises → microtask queue.
   - Timers / DOM events / `postMessage` / I/O → macrotask queue.
4. Event Loop: when the Stack becomes empty, it drains microtasks first, then takes the next macrotask, repeats.

## 5) Worked example and output order
Example used in the session (or equivalent):

```js
console.log('A');

setTimeout(() => {
  console.log('B');
  Promise.resolve().then(() => {
    console.log('C');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('D');
  setTimeout(() => {
    console.log('E');
  }, 0);
});

console.log('F');
```

Step-by-step:
- Sync phase on Stack: prints `A`, schedules timer T1, schedules microtask M1, prints `F`.
- End of script → flush microtasks: run M1 → prints `D`, schedules timer T2.
- Next macrotask (T1) → prints `B`, schedules microtask M2.
  - Flush microtasks: run M2 → prints `C`.
- Next macrotask (T2) → prints `E`.

Final console output: `A, F, D, B, C, E`.

Why:
- Microtasks (`Promise.then`) always run before the next macrotask.
- Timers are macrotasks and must wait for the microtask queue to be fully drained.

## 6) Rendering and performance notes
- Browsers typically paint between macrotasks. If you need a UI update before heavy work, split the work across tasks or use `requestAnimationFrame` to align with the next frame.
- Be careful with microtask “starvation”: continuously queuing microtasks can delay timers and paints.
- Prefer chunking long computations with `setTimeout(..., 0)`/`requestIdleCallback` or yielding with `await` (which queues a microtask) to keep the UI responsive.

## 7) Browser vs Node.js specifics
- Browser microtasks: `Promise`/`queueMicrotask`/`MutationObserver`. No `process.nextTick`.
- Node.js event loop has phases (timers → pending callbacks → idle/prepare → poll → check → close). Microtasks run between phases and after callbacks.
- `process.nextTick` (Node-only) runs before other microtasks, which can starve the loop if overused.
- `setImmediate` is a macrotask scheduled for the “check” phase; its ordering vs `setTimeout(..., 0)` can differ depending on context.

## 8) Practical tips
- If you need to run code “right after” current sync code finishes but before timers and I/O, use a microtask (`Promise.resolve().then(...)` or `queueMicrotask`).
- For UI updates, use `requestAnimationFrame` to batch DOM reads/writes with the browser’s paint.
- For sequencing timers vs promises: remember Promises win the next turn because microtasks are drained first.
- To avoid blocking: split heavy work and consider Workers for CPU-bound tasks.

## 9) Mapping back to the screenshot
- Heap/Stack (left): synchronous JS execution environment.
- Web APIs (right): timer, network, DOM sources that hold async operations.
- Queue (bottom): two lanes — Callback/Tasks (macrotasks) and Micro Tasks (microtasks).
- Event Loop (center): moves ready items from queues to the Stack, always draining microtasks before the next task.

That is the operational meaning of the Event Loop diagram you captured.
'use client';

import { useState, useTransition } from 'react';

export default function ProblemPage() {
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const LIST_SIZE = 2000;
  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);

    startTransition(() => {
      let l = [];
      for (let i = 0; i < LIST_SIZE; i++) {
        l.push(e.target.value);
      }
      setList(l);
    });
  }

  return (
    <div>
      <input type="text" value={input} onChange={changeHandler} />
      {isPending ? (
        'Loading...'
      ) : (
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*
  ## SOLUTION: Use `useTransition` Hook..
    * By default all state updates are high priority.
    * useTransition hook allows you to mark the `setList` as a low-priority update => The list update is deferred and happens in the background.
    * If the user types quickly, React may interrupt the previous list update to prioritize the new input value. => allows the input value updates immediately.
    * Once the list update completes => The `isPending` flag is set to false, and the list is rendered.
  
  ## Drawbacks and Considerations:
    1- Double Rendering - React render the comp twice:
        * Once for the high-priority update (e.g., updating the input field).
        * Once for the low-priority update (e.g., updating the list).

    2- Interruptible Updates - React can interrupt low-priority updates if a higher-priority update comes in:
        * If the user types rapidly, the list update might be interrupted multiple times => leads to wasted work (the interrupted update is discarded and restarted).
*/

'use client';

import { useState } from 'react';

export default function ProblemPage() {
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);

  const LIST_SIZE = 2000;
  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);

    const l = [];
    for (let i = 0; i < LIST_SIZE; i++) {
      l.push(e.target.value);
    }

    setList(l);
  }

  return (
    <div>
      <input type="text" value={input} onChange={changeHandler} />
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/*
  ## PROBLEM: Very Slow APP..

  ## In order to fix this issue we need to understand the Way React work?
    * React batches state updates that occur within the same event handler.
    * React schedules renders of the comp after the `changeHandler` function finishes.
    * Both `setInput` and `setList` are batched together, and React will re-render the component ONLY ONCE AFTER BOTH STATE UPDATES ARE PROCESSED.
    * Because of rendering the <ul> with 2000 <li> elements is an expensive operation, and this operation runs on every keystroke => The app wil be very slow (The UI feel sluggish). 

  ## Important Note:
    * The bottleneck is not the loop itself but the combination of the loop and the `setList` call.
    * Removing `setList` => The loop still runs, but its result (l) is not used, so React skips the expensive list rendering.
  
  ## Visualizing the Workflow:
    @ With setList(l):
      1- User types -> `changeHandler` runs:
        - Loop executes.
        - setInput schedules a state update (input rerender is fast).
        - setList schedules a state update (list rerender is slow).

      2- React rerenders the <ul> with 2000 <li> elements, causing the app to feel slow.
    
    @ Without setList(l):
     1- User types -> changeHandler runs:
       - Loop executes.
       - setInput schedules a state update (input rerender is fast).
       
     2- React rerenders only the <input>, skipping the list update. The UI remains responsive.
*/

// npm install easybase-react
import React, { useState, useEffect } from "react";

import { EasybaseProvider, useEasybase } from "easybase-react";
import ebconfig from "./ebconfig.js";

function Container() {
  const { Frame, useFrameEffect, configureFrame, sync } = useEasybase();

  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [othertext, setOtherText] = useState("");

  useEffect(() => {
    configureFrame({ limit: 10, offset: 0, tableName: "LISTOFDATA" });
    sync();
    // this *should* be [configureFrame, sync] because we want the useEffect hook to fire if
    // those values change. However, easybase-react *always* updates them, so we need to pass
    // an empty array. And then disable the warning in the linter. I consider this a bug in easybase.
    // eslint-disable-next-line
  }, []);

  useFrameEffect(() => {
    console.log("Frame changed!");
  });

  return (
    <div>
      {Frame().map((ele, index) => (
        <div>
          {ele.name}, {ele.number}, {ele.othertext}
        </div>
      ))}
      <div>
        <div>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          Number:
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div>
          Other Text:
          <input
            type="text"
            value={othertext}
            onChange={(e) => setOtherText(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={() => {
              Frame().push({
                name,
                number,
                othertext,
              });
              sync();
              setName("");
              setNumber(0);
              setOtherText("");
            }}
          >
            Save values
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <EasybaseProvider ebconfig={ebconfig}>
      <Container />
      <Container />
    </EasybaseProvider>
  );
}

export default App;

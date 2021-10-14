// import { useEffect, useRef, useState } from "react";
// import Editable from "./components/Editable";
// import {
//   getCaretCharacterOffsetWithin,
//   getSelectionText,
//   KEYS,
//   placeCaretAtEnd,
//   setCaretPosition,
//   snapSelectionToWord,
// } from "./utils";

// function App() {
//   const [counter, setCounter] = useState(1);
//   const [blank, setBlank] = useState("");
//   const state = useRef([{ html: "" }]);
//   const itemsRef = useRef([]);
//   const currentItem = useRef("");

//   const addNewBlock = (index) => {
//     if (index === state.current.length - 1) {
//       state.current = [...state.current, { html: "" }];
//     } else {
//     }
//   };

//   const handleChange = (e, idx) => {
//     state.current[idx].html = e.target.textContent;
//   };

//   const onFocus = (e) => {
//     currentItem.current = e.target;
//   };

//   const onKeyDown = (e, idx) => {
//     // console.log(e.which);
//     if (!currentItem.current) return;
//     switch (e.which) {
//       case KEYS.UP: {
//         if (!currentItem.current.previousSibling) return;
//         currentItem.current = currentItem.current.previousSibling;
//         currentItem.current.focus();
//         setTimeout(() => {
//           placeCaretAtEnd(currentItem.current);
//         }, 0);

//         break;
//       }
//       case KEYS.DOWN: {
//         if (!currentItem.current.nextSibling) return;
//         currentItem.current = currentItem.current.nextSibling;
//         currentItem.current.focus();
//         break;
//       }
//       case KEYS.ENTER: {
//         if (
//           idx === state.current.length - 1 &&
//           state.current[state.current.length - 1].html !== ""
//         ) {
//           e.preventDefault();
//           addNewBlock(idx);
//           setBlank(blank + " ");
//         }
//         break;
//       }

//       case KEYS.BACKSPACE: {
//         if (idx === 0) return;
//         let pos = getCaretCharacterOffsetWithin(currentItem.current);
//         if (pos === 0) {
//           // get its data
//           let currentHtml = state.current[idx].html;
//           let arr = [...state.current];

//           //focus on previous
//           let textLengthBeforeMerge =
//             currentItem.current.previousSibling.textContent.length;

//           currentItem.current = currentItem.current.previousSibling;
//           currentItem.current.focus();
//           setTimeout(() => {
//             placeCaretAtEnd(currentItem.current);
//           }, 0);

//           //append html to previous
//           arr[idx - 1].html += currentHtml;

//           //delete it
//           arr.splice(idx, 1);
//           state.current = arr;
//           setCounter(counter - 1); //setcounter for items

//           //set caret between two merges
//           if (currentItem.current.textContent !== "") {
//             setTimeout(() => {
//               setCaretPosition(currentItem.current, textLengthBeforeMerge);
//             }, 0);
//           }
//         }
//         break;
//       }

//       default: {
//         break;
//       }
//     }
//   };

//   const onMouseUp = (e) => {
//     const selectedText = getSelectionText();

//     if (selectedText.trim().length > 0) {
//       snapSelectionToWord();
//     }

//     // }
//   };

//   useEffect(() => {
//     let nextSibling = currentItem?.current?.nextSibling;
//     if (nextSibling) {
//       nextSibling.focus();
//       currentItem.current = nextSibling;
//     }
//   }, [blank]);

//   return (
//     <>
//       <div style={{ margin: "20vh 20vw" }} className="App">
//         {state.current.map((el, idx) => (
//           <Editable
//             innerRef={(item) => (itemsRef.current[idx] = item)}
//             handleChange={(e) => handleChange(e, idx)}
//             html={el.html}
//             onKeyDown={(e) => {
//               onKeyDown(e, idx);
//             }}
//             onFocus={onFocus}
//             key={idx}
//             onMouseUp={onMouseUp}
//           />
//         ))}
//       </div>
//     </>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import Editor from "./components/Editor";

useEffect(() => {}, []);

const App = () => {
  return (
    <div>
      <Editor />
    </div>
  );
};

export default App;

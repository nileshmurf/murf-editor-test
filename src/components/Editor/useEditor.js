import { useEffect, useRef, useState } from "react";
import {
  debounce,
  getAllTextAfterCaret,
  getCaretIndex,
  getSelectionText,
  KEYS,
  placeCaretAtEnd,
  setCaretPosition,
  snapSelectionToWord,
} from "../../utils";

import uuid from "react-uuid";

const useEditor = () => {
  const [focusSetter, setFocusSetter] = useState(1);
  const [caretSetter, setCaretSetter] = useState("");
  const [disableCaretSetter, setDisableCaretSetter] = useState(false);
  const prevState = useRef([]);
  const state = useRef([{ id: uuid(), html: "Nilesh is a React dev." }]);
  const itemsRef = useRef([]);
  const currentItem = useRef("");
  const currentIndex = useRef("");

  useEffect(() => {
    if (disableCaretSetter) {
      setDisableCaretSetter(false);
      return;
    }

    setCaretPosition(currentItem.current, getCaretIndex(currentItem.current));
  }, [caretSetter]);

  useEffect(() => {
    let nextSibling = currentItem?.current?.nextSibling;
    if (nextSibling) {
      nextSibling.focus();
      currentItem.current = nextSibling;
    }
    setCaretPosition(currentItem.current, getCaretIndex(currentItem.current));
  }, [focusSetter]);

  const addNewBlock = (text = "") => {
    let newState = [...state.current];
    newState.splice(currentIndex.current + 1, 0, { id: uuid(), html: text });
    state.current = newState;
    setFocusSetter(focusSetter + 1);
  };

  const handleChange = (value, idx) => {
    var regex = /\S+/g;
    // var result = value.replace(regex, function (a) {
    //   return "<span>" + a + "</span>";
    // });
    // currentItem.current.innerHTML = result;
    // state.current[idx].html = result;

    state.current[idx].html = value;
    updateRefs();
  };

  const updateRefs = () => {
    clearTimeout(window.editorTimer);
    window.editorTimer = setTimeout(() => {
      setCaretSetter(caretSetter + " ");
    }, 500);
  };

  const onFocus = (e, idx) => {
    currentItem.current = e.target;
    currentIndex.current = idx;

    currentItem.current.innerHTML = [...currentItem.current.childNodes]
      .map((el) => el.textContent)
      .join("");

    state.current[currentIndex.current].html = [
      ...currentItem.current.childNodes,
    ]
      .map((el) => el.textContent)
      .join("");

    updateRefs();
  };

  const onBlur = () => {
    let currentText = currentItem.current.textContent;
    var regex = /\S+/g;
    var result = currentText.replace(regex, function (a) {
      return "<span>" + a + "</span>";
    });
    currentItem.current.innerHTML = result;
    state.current[currentIndex.current].html = result;
    // setDisableCaretSetter(true);
    updateRefs();
  };

  const onMouseUp = (e) => {
    // const selectedText = getSelectionText();
    // if (selectedText.trim().length > 0) {
    //   snapSelectionToWord();
    // }
  };

  const onMouseDown = (e) => {
    // setCaretPosition(currentItem.current, 0, e.target);
    // currentItem.current.focus();
  };

  const onContextMenu = (e) => {
    e.preventDefault();
    console.log(e.clientX, e.clientY);
    console.log(getCaretIndex(currentItem.current));
  };

  useEffect(() => {
    if (JSON.stringify(prevState.current) !== JSON.stringify(state.current)) {
      prevState.current = state.current;
    }
  });

  const onKeyDown = (e, idx) => {
    if (!currentItem.current) return;

    switch (e.which) {
      case KEYS.UP: {
        if (!currentItem.current.previousSibling) return;
        currentItem.current = currentItem.current.previousSibling;
        currentItem.current.focus();
        setTimeout(() => {
          placeCaretAtEnd(currentItem.current);
        }, 0);

        break;
      }
      case KEYS.DOWN: {
        if (!currentItem.current.nextSibling) return;
        currentItem.current = currentItem.current.nextSibling;
        currentItem.current.focus();
        break;
      }

      // case KEYS.SPACE: {
      //   e.preventDefault();
      //   let span = document.createElement("span");
      //   currentItem.current.appendChild(span);

      //   break;
      // }
      case KEYS.ENTER: {
        e.preventDefault();

        const {
          splitText,
          fullText = "",
          caretPos,
        } = getAllTextAfterCaret(currentItem.current);

        handleChange(fullText.substr(0, caretPos), currentIndex.current);
        addNewBlock(splitText);
        updateRefs();

        break;
      }

      case KEYS.BACKSPACE: {
        if (idx === 0) return;
        let pos = getCaretIndex(currentItem.current);
        if (pos === 0) {
          // get its data
          let currentHtml = state.current[idx].html;
          let arr = [...state.current];

          //focus on previous
          let textLengthBeforeMerge =
            currentItem.current.previousSibling.textContent.length;

          currentItem.current = currentItem.current.previousSibling;
          currentItem.current.focus();
          setTimeout(() => {
            placeCaretAtEnd(currentItem.current);
          }, 0);

          //append html to previous
          arr[idx - 1].html += currentHtml;

          //delete it
          arr.splice(idx, 1);
          state.current = arr;
          setFocusSetter(focusSetter - 1); //setFocusSetter for items

          //set caret between two merges
          if (currentItem.current.textContent !== "") {
            setTimeout(() => {
              setCaretPosition(currentItem.current, textLengthBeforeMerge);
            }, 0);
          }
          updateRefs();
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  return {
    state,
    itemsRef,
    eventHandlers: {
      onKeyDown,
      handleChange,
      onFocus,
      onMouseUp,
      onBlur,
      onMouseDown,
      onContextMenu,
    },
  };
};

export default useEditor;

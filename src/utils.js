// export const placeCaretAtEnd = (el) => {
//   el.focus();
//   if (
//     typeof window.getSelection != "undefined" &&
//     typeof document.createRange != "undefined"
//   ) {
//     var range = document.createRange();
//     range.selectNodeContents(el);
//     range.collapse(false);
//     var sel = window.getSelection();
//     sel.removeAllRanges();
//     sel.addRange(range);
//   } else if (typeof document.body.createTextRange != "undefined") {
//     var textRange = document.body.createTextRange();
//     textRange.moveToElementText(el);
//     textRange.collapse(false);
//     textRange.select();
//   }
// };

export const placeCaretAtEnd = (contentEditableElement) => {
  var range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    //IE
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    range.collapse(false);
    range.select();
  }
};

// export const getCaretPosition = (element) => {
//   var caretOffset = 0;
//   var doc = element.ownerDocument || element.document;
//   var win = doc.defaultView || doc.parentWindow;
//   var sel;
//   if (typeof win.getSelection !== "undefined") {
//     sel = win.getSelection();
//     if (sel.rangeCount > 0) {
//       var range = win.getSelection().getRangeAt(0);
//       var preCaretRange = range.cloneRange();
//       preCaretRange.selectNodeContents(element);
//       preCaretRange.setEnd(range.endContainer, range.endOffset);
//       caretOffset = preCaretRange.toString().length;
//     }
//   } else if ((sel = doc.selection) && sel.type !== "Control") {
//     var textRange = sel.createRange();
//     var preCaretTextRange = doc.body.createTextRange();
//     preCaretTextRange.moveToElementText(element);
//     preCaretTextRange.setEndPoint("EndToEnd", textRange);
//     caretOffset = preCaretTextRange.text.length;
//   }
//   return caretOffset;
// };

// node_walk: walk the element tree, stop when func(node) returns false
function node_walk(node, func) {
  var result = func(node);
  for (
    node = node.firstChild;
    result !== false && node;
    node = node.nextSibling
  )
    result = node_walk(node, func);
  return result;
}

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)
export const getCaretPosition = (elem) => {
  var sel = window.getSelection();
  var cum_length = [0, 0];

  if (sel.anchorNode === elem)
    cum_length = [sel.anchorOffset, sel.extentOffset];
  else {
    var nodes_to_find = [sel.anchorNode, sel.extentNode];
    if (!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
      return undefined;
    else {
      var found = [0, 0];
      var i;
      node_walk(elem, function (node) {
        for (i = 0; i < 2; i++) {
          if (node === nodes_to_find[i]) {
            found[i] = true;
            if (found[i === 0 ? 1 : 0]) return false; // all done
          }
        }

        if (node.textContent && !node.firstChild) {
          for (i = 0; i < 2; i++) {
            if (!found[i]) cum_length[i] += node.textContent.length;
          }
        }
      });
      cum_length[0] += sel.anchorOffset;
      cum_length[1] += sel.extentOffset;
    }
  }
  if (cum_length[0] <= cum_length[1]) return cum_length;
  return [cum_length[1], cum_length[0]];
};

export const setCaretPosition = (elem, pos, child = null) => {
  if (!elem?.childNodes?.length) return;
  let el = elem;
  let nthChild = child
    ? child
    : el.childNodes.length > 1
    ? el.childNodes[el.childNodes.length - 1]
    : el.childNodes[0];

  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(nthChild, nthChild.length);

  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
};

export const snapSelectionToWord = () => {
  var sel;

  // Check for existence of window.getSelection() and that it has a
  // modify() method. IE 9 has both selection APIs but no modify() method.
  if (window.getSelection && (sel = window.getSelection()).modify) {
    sel = window.getSelection();

    if (!sel.isCollapsed) {
      // Detect if selection is backwards
      let range = document.createRange();
      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);
      let backwards = range.collapsed;
      range.detach();

      // modify() works on the focus of the selection
      var endNode = sel.focusNode,
        endOffset = sel.focusOffset;
      sel.collapse(sel.anchorNode, sel.anchorOffset);

      var direction = [];
      if (backwards) {
        direction = ["backward", "forward"];
      } else {
        direction = ["forward", "backward"];
      }

      sel.modify("move", direction[0], "character");
      sel.modify("move", direction[1], "word");
      sel.extend(endNode, endOffset);
      sel.modify("extend", direction[1], "character");
      sel.modify("extend", direction[0], "word");
    }
  } else if ((sel = document.selection) && sel.type !== "Control") {
    var textRange = sel.createRange();
    if (textRange.text) {
      textRange.expand("word");
      // Move the end back to not include the word's trailing space(s),
      // if necessary
      while (/\s$/.test(textRange.text)) {
        textRange.moveEnd("character", -1);
      }
      textRange.select();
    }
  }
};

export const getSelectionTextInfo = (el) => {
  var atStart = false,
    atEnd = false;
  var selRange, testRange;
  if (window.getSelection) {
    var sel = window.getSelection();

    if (sel.rangeCount) {
      selRange = sel.getRangeAt(0);
      testRange = selRange.cloneRange();

      testRange.selectNodeContents(el);
      testRange.setEnd(selRange.startContainer, selRange.startOffset);
      atStart = testRange.toString() === "";

      testRange.selectNodeContents(el);
      testRange.setStart(selRange.endContainer, selRange.endOffset);
      atEnd = testRange.toString() === "";
    }
  } else if (document.selection && document.selection.type !== "Control") {
    selRange = document.selection.createRange();
    testRange = selRange.duplicate();

    testRange.moveToElementText(el);
    testRange.setEndPoint("EndToStart", selRange);
    atStart = testRange.text === "";

    testRange.moveToElementText(el);
    testRange.setEndPoint("StartToEnd", selRange);
    atEnd = testRange.text === "";
  }

  return { atStart: atStart, atEnd: atEnd };
};
export const getCaretIndex = (element) => {
  if (!element) return;
  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
  }
  return position;
};

export const getAllTextAfterCaret = (el) => {
  let { atEnd } = getSelectionTextInfo(el);
  let textBeforeExtract = el.innerText;
  let selection = window.getSelection();
  const pos = getCaretIndex(el);

  if (atEnd)
    return {
      splitText: "",
      caretPos: pos,
      fullText: textBeforeExtract,
    };

  let range = new Range();
  range.selectNodeContents(el);
  range.setStart(el.firstChild, pos);
  range.setEnd(el.firstChild, el.firstChild.length);
  selection.removeAllRanges();
  selection.addRange(range);
  let fragment = range.extractContents();
  let div = document.createElement("div");
  div.appendChild(fragment);
  return {
    splitText: div.innerHTML,
    caretPos: pos,
    fullText: textBeforeExtract,
  };
};

export const getSelectionText = () => {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== "Control") {
    text = document.selection.createRange().text;
  }
  return text;
};

export const KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  BACKSPACE: 8,
  SPACE: 32,
};

export const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

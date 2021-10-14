import Editable from "../Editable";
import useEditor from "./useEditor";

function Editor() {
  const {
    state,
    itemsRef,
    eventHandlers: {
      onFocus,
      onKeyDown,
      onMouseUp,
      handleChange,
      onBlur,
      onMouseDown,
      onContextMenu,
    },
  } = useEditor();

  return (
    <>
      <div style={{ margin: "20vh 20vw" }} className="App">
        {state.current.map((el, idx) => (
          <Editable
            innerRef={(item) => (itemsRef.current[idx] = item)}
            html={el.html}
            key={el.id}
            index={idx}
            onFocus={onFocus}
            onMouseUp={onMouseUp}
            handleChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => {
              onKeyDown(e, idx);
            }}
            onBlur={onBlur}
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
      <button
        onClick={() => {
          console.log(state);
        }}
      >
        click
      </button>
    </>
  );
}

export default Editor;

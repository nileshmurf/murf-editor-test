import React, { useRef } from "react";
import ContentEditable from "react-contenteditable";

// const Editable = ({
//   html,
//   handleChange,
//   onFocus,
//   onKeyDown,
//   onMouseUp,
//   index,
//   onBlur,
//   onMouseDown,
//   onContextMenu,
// }) => {
//   const innerRef = useRef(html);
//   return (
//     <div
//       className="editable"
//       placeholder="Enter your text here"
//       contentEditable="true"
//       style={{ width: "100%" }}
//       dangerouslySetInnerHTML={{ __html: innerRef.current }}
//       onInput={(e) => handleChange(e.target.textContent, index)}
//       onKeyDown={onKeyDown}
//       onFocus={(e) => onFocus(e, index)}
//       onMouseUp={onMouseUp}
//       onMouseDown={onMouseDown}
//       onBlur={onBlur}
//       onContextMenu={onContextMenu}
//     ></div>
//   );
// };

// export default Editable;

export default class Editable extends React.Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
    // this.innerRef.current = this.props.html;
  }

  render() {
    return (
      // <div
      //   className="editable"
      //   placeholder="Enter your text here"
      //   contentEditable="true"
      //   style={{ width: "100%" }}
      //   dangerouslySetInnerHTML={{ __html: this.innerRef.current }}
      //   onInput={(e) =>
      //     this.props.handleChange(e.target.textContent, this.props.index)
      //   }
      //   onKeyDown={this.props.onKeyDown}
      //   onFocus={(e) => this.props.onFocus(e, this.props.index)}
      //   onMouseUp={this.props.onMouseUp}
      //   onMouseDown={this.props.onMouseDown}
      //   onBlur={this.props.onBlur}
      //   onContextMenu={this.props.onContextMenu}
      // ></div>

      <ContentEditable
        className="editable"
        placeholder="Enter your text here"
        contentEditable="true"
        style={{ width: "100%" }}
        // html={{ __html: this.props.html }}
        html={this.props.html}
        onChange={(e) => {
          this.props.handleChange(e.target.value, this.props.index);
        }}
        onKeyDown={this.props.onKeyDown}
        onFocus={(e) => this.props.onFocus(e, this.props.index)}
        onMouseUp={this.props.onMouseUp}
        onMouseDown={this.props.onMouseDown}
        onBlur={this.props.onBlur}
        onContextMenu={this.props.onContextMenu}
        innerRef={this.innerRef}
      />
    );
  }
}

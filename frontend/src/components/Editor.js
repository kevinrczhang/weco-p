import React from "react";
import PropTypes from 'prop-types';
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar.js";
import "react-quill/dist/quill.snow.css";

const Editor = ({ label, value, onChange }) => {
  return (
    <div className="text-editor">
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={value}
        placeholder={label}
        onChange={e => onChange(e)}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

Editor.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Editor;
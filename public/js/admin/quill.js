var Inline = Quill.import("blots/inline");

class UppercaseBlot extends Inline {
  static create() {
    let node = super.create();
    node.style.textTransform = "uppercase";
    return node;
  }

  static formats() {
    return true;
  }
}

UppercaseBlot.blotName = "uppercase";
UppercaseBlot.tagName = "span";
UppercaseBlot.className = "ql-uppercase";

Quill.register(UppercaseBlot);

class LowercaseBlot extends Inline {
  static create() {
    let node = super.create();
    node.style.textTransform = "lowercase";
    return node;
  }

  static formats() {
    return true;
  }
}

LowercaseBlot.blotName = "lowercase";
LowercaseBlot.tagName = "span";
LowercaseBlot.className = "ql-lowercase";

Quill.register(LowercaseBlot);

// 🛠️ Custom Toolbar Handler for Uppercase & Lowercase
function customToolbarHandler(quill, format) {
  let range = quill.getSelection();
  if (range) {
    let formatState = quill.getFormat(range);
    quill.format(format, !formatState[format]);
  }
}

// 📌 Function to Initialize Quill Editors
function initializeQuill(selector) {
  const editor = document.querySelector(selector);
  if (!editor) return null; // Prevent errors if element doesn't exist

  return new Quill(selector, {
    modules: {
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          ["link", "blockquote", "code-block", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ header: [1, 2, false] }],
          [{ align: [] }],
          [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
          [{ color: [] }, { background: [] }], // Fixed comma issue
          [{ size: ["small", false, "large", "huge"] }], // Font size
          ["clean"],
          [{ uppercase: "uppercase" }],
          [{ lowercase: "lowercase" }],
        ],
        handlers: {
          uppercase: function () {
            customToolbarHandler(this.quill, "uppercase");
          },
          lowercase: function () {
            customToolbarHandler(this.quill, "lowercase");
          },
        },
      },
    },
    theme: "snow",
  });
}

// 🎯 Initialize Main Editor
const quill = initializeQuill("#quilleditor");

// 🎯 Initialize Second Editor (If Exists)
const quill2 = document.getElementById("quilleditor2") ? initializeQuill("#quilleditor2") : null;

export { quill, quill2 };

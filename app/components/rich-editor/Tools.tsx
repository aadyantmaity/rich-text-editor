import { ChangeEventHandler, FC, useState } from "react";
import {
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiBold,
  BiCodeAlt,
  BiCodeCurly,
  BiImageAlt,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
  BiSave,
} from "react-icons/bi";
import ToolButton from "./ToolButton";
import { BubbleMenu, ChainedCommands, Editor } from "@tiptap/react";
import LinkForm from "./LinkForm";
import LinkEditForm from "./LinkEditForm";

interface Props {
  editor: Editor | null;
  onImageSelection?(): void;
}

const tools = [
  { task: "bold", icon: <BiBold size={20} /> },
  { task: "italic", icon: <BiItalic size={20} /> },
  { task: "underline", icon: <BiUnderline size={20} /> },
  { task: "strike", icon: <BiStrikethrough size={20} /> },
  { task: "code", icon: <BiCodeAlt size={20} /> },
  { task: "codeBlock", icon: <BiCodeCurly size={20} /> },
  { task: "left", icon: <BiAlignLeft size={20} /> },
  { task: "center", icon: <BiAlignMiddle size={20} /> },
  { task: "right", icon: <BiAlignRight size={20} /> },
  { task: "bulletList", icon: <BiListUl size={20} /> },
  { task: "orderedList", icon: <BiListOl size={20} /> },
  { task: "image", icon: <BiImageAlt size={20} /> },
];

const headingOptions = [
  { task: "p", value: "Paragraph" },
  { task: "h1", value: "Heading 1" },
  { task: "h2", value: "Heading 2" },
  { task: "h3", value: "Heading 3" },
];

const chainMethods = (
  editor: Editor | null,
  command: (chain: ChainedCommands) => ChainedCommands
) => {
  if (!editor) return;
  command(editor.chain().focus()).run();
};

type TaskType = (typeof tools)[number]["task"];
type HeadingType = (typeof headingOptions)[number]["task"];

const Tools: FC<Props> = ({ editor, onImageSelection }) => {
  const [isSaved, setIsSaved] = useState(true); // Track save status

  const handleOnClick = (task: TaskType) => {
    switch (task) {
      case "bold":
        return chainMethods(editor, (chain) => chain.toggleBold());
      case "italic":
        return chainMethods(editor, (chain) => chain.toggleItalic());
      case "underline":
        return chainMethods(editor, (chain) => chain.toggleUnderline());
      case "strike":
        return chainMethods(editor, (chain) => chain.toggleStrike());
      case "code":
        return chainMethods(editor, (chain) => chain.toggleCode());
      case "codeBlock":
        return chainMethods(editor, (chain) => chain.toggleCodeBlock());
      case "orderedList":
        return chainMethods(editor, (chain) => chain.toggleOrderedList());
      case "bulletList":
        return chainMethods(editor, (chain) => chain.toggleBulletList());
      case "left":
        return chainMethods(editor, (chain) => chain.setTextAlign("left"));
      case "center":
        return chainMethods(editor, (chain) => chain.setTextAlign("center"));
      case "right":
        return chainMethods(editor, (chain) => chain.setTextAlign("right"));
      case "image":
        return onImageSelection && onImageSelection();
      default:
        return;
    }
  };

  const handleSave = () => {
    if (editor) {
      const content = editor.getJSON(); // Get the editor content in JSON format
      // Save content to localStorage (you can replace this with a backend call)
      localStorage.setItem("document", JSON.stringify(content)); // Save in localStorage

      setIsSaved(true); // Mark the document as saved
    }
  };

  const handleLinkSubmission = (href: string) => {
    if (href === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const handleHeadingSelection: ChangeEventHandler<HTMLSelectElement> = ({
    target,
  }) => {
    const { value } = target as { value: HeadingType };

    switch (value) {
      case "p":
        return chainMethods(editor, (chain) => chain.setParagraph());
      case "h1":
        return chainMethods(editor, (chain) =>
          chain.toggleHeading({ level: 1 })
        );
      case "h2":
        return chainMethods(editor, (chain) =>
          chain.toggleHeading({ level: 2 })
        );
      case "h3":
        return chainMethods(editor, (chain) =>
          chain.toggleHeading({ level: 3 })
        );
    }
  };

  const getInitialLink = () => {
    const attributes = editor?.getAttributes("link");
    if (attributes) return attributes.href;
  };

  const getSelectedHeading = (): HeadingType => {
    let result: HeadingType = "p";

    if (editor?.isActive("heading", { level: 1 })) result = "h1";
    if (editor?.isActive("heading", { level: 2 })) result = "h2";
    if (editor?.isActive("heading", { level: 3 })) result = "h3";

    return result;
  };

  return (
    <div className="flex items-start space-x-1">
      <select
        value={getSelectedHeading()}
        className="p-2"
        onChange={handleHeadingSelection}
      >
        {headingOptions.map((item) => {
          return (
            <option key={item.task} value={item.task}>
              {item.value}
            </option>
          );
        })}
      </select>

      <LinkForm onSubmit={handleLinkSubmission} />

      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("link")}
      >
        <LinkEditForm
          initialState={getInitialLink()}
          onSubmit={handleLinkSubmission}
        />
      </BubbleMenu>

      {tools.map(({ icon, task }) => {
        return (
          <ToolButton
            key={task}
            onClick={() => handleOnClick(task)}
            active={
              editor?.isActive(task) || editor?.isActive({ textAlign: task })
            }
          >
            {icon}
          </ToolButton>
        );
      })}

      <ToolButton onClick={handleSave} active={isSaved}>
        <BiSave size={20} />
        {!isSaved && <span className="text-sm text-red-500">Saving...</span>}
      </ToolButton>
    </div>
  );
};

export default Tools;

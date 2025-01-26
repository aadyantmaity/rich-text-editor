import { ChangeEventHandler, FC } from "react";
import { BiAlignLeft, BiAlignMiddle, BiAlignRight, BiBold, BiCodeAlt, BiCodeCurly, BiImageAlt, BiItalic, BiListOl, BiListUl, BiStrikethrough, BiUnderline } from "react-icons/bi";
import ToolButton from "./ToolButton";
import { BubbleMenu, ChainedCommands, Editor } from "@tiptap/react";
import LinkForm from "./LinkForm";
import LinkEditForm from "./LinkEditForm";

interface Props {
  editor: Editor | null;
  onImageSelection?(): void;
  onPageSizeChange(pageSize: string): void;
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
] as const;

const headingOptions = [
  { task: "p", value: "Paragraph" },
  { task: "h1", value: "Heading 1" },
  { task: "h2", value: "Heading 2" },
  { task: "h3", value: "Heading 3" },
] as const;

const colorOptions = [
  { label: "Red", value: "#ff0000" },
  { label: "Green", value: "#00ff00" },
  { label: "Blue", value: "#0000ff" },
  { label: "Black", value: "#000000" },
] as const;

const fontOptions = [
  { label: "Arial", value: "Arial" },
  { label: "Courier New", value: "Courier New" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Verdana", value: "Verdana" },
  { label: "Tahoma", value: "Tahoma" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Comic Sans MS", value: "Comic Sans MS" },
  { label: "Impact", value: "Impact" },
  { label: "Lucida Console", value: "Lucida Console" },
  { label: "Arial Black", value: "Arial Black" },
  { label: "Palatino Linotype", value: "Palatino Linotype" },
  { label: "Century Gothic", value: "Century Gothic" },
  { label: "Book Antiqua", value: "Book Antiqua" },
  { label: "Calibri", value: "Calibri" },
] as const;

const chainMethods = (editor: Editor | null, command: (chain: ChainedCommands) => ChainedCommands) => {
  if (!editor) return;
  command(editor.chain().focus()).run();
};

type TaskType = (typeof tools)[number]["task"];
type HeadingType = (typeof headingOptions)[number]["task"];
type ColorType = typeof colorOptions[number]["value"];
type FontType = typeof fontOptions[number]["value"];

const Tools: FC<Props> = ({ editor, onImageSelection, onPageSizeChange }) => {
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
    }
  };

  const handleLinkSubmission = (href: string) => {
    if (href === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const handleHeadingSelection: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const { value } = target as { value: HeadingType };

    switch (value) {
      case "p":
        return chainMethods(editor, (chain) => chain.setParagraph());
      case "h1":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 1 }));
      case "h2":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 2 }));
      case "h3":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 3 }));
    }
  };

  const handleColorSelection: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const { value } = target as { value: ColorType };
    editor?.chain().focus().setColor(value).run();
  };

  const handleFontSelection: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const { value } = target as { value: FontType };
    editor?.chain().focus().setFontFamily(value).run();
  };

  const getSelectedHeading = (): HeadingType => {
    let result: HeadingType = "p";
    if (editor?.isActive("heading", { level: 1 })) result = "h1";
    if (editor?.isActive("heading", { level: 2 })) result = "h2";
    if (editor?.isActive("heading", { level: 3 })) result = "h3";
    return result;
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 flex items-start space-x-1">
      <select value={getSelectedHeading()} className="p-2" onChange={handleHeadingSelection}>
        {headingOptions.map((item) => (
          <option key={item.task} value={item.task}>
            {item.value}
          </option>
        ))}
      </select>

      <select className="p-2" onChange={handleColorSelection}>
        {colorOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select className="p-2" onChange={handleFontSelection}>
        {fontOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onPageSizeChange(e.target.value)}
        className="p-2"
      >
        <option value="Letter">Letter</option>
        <option value="A4">A4</option>
        <option value="A5">A5</option>
        <option value="A6">A6</option>
      </select>

      <LinkForm onSubmit={handleLinkSubmission} />

      <BubbleMenu editor={editor} shouldShow={({ editor }) => editor.isActive("link")}>
        <LinkEditForm initialState={getSelectedHeading()} onSubmit={handleLinkSubmission} />
      </BubbleMenu>

      {tools.map(({ icon, task }) => (
        <ToolButton
          key={task}
          onClick={() => handleOnClick(task)}
          active={editor?.isActive(task) || editor?.isActive({ textAlign: task })}
        >
          {icon}
        </ToolButton>
      ))}
    </div>
  );
};

export default Tools;

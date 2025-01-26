"use client"

import { FC, useState, useEffect } from "react";
import { EditorProvider, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Tools from "./Tools";
import ImageGallery from "./ImageGallery";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

interface Props {}

const extensions = [
  StarterKit,
  Underline,
  Image.configure({
    inline: false,
    HTMLAttributes: {
      class: "w-[80%] mx-auto",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      target: "",
    },
  }),
];

const RichEditor: FC<Props> = () => {
  const [showImageGallery, setShowImageGallery] = useState(false);

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl outline-none",
      },
    },
  });

  // Load saved document from localStorage
  useEffect(() => {
    const savedDocument = localStorage.getItem("document");
    if (savedDocument && editor) {
      const content = JSON.parse(savedDocument);
      editor.commands.setContent(content); // Set the content to the editor
    }
  }, [editor]);

  const onImageSelect = (image: string) => {
    editor?.chain().focus().setImage({ src: image, alt: "img" }).run();
  };

  return (
    <>
      <div className="h-screen flex flex-col space-y-6">
        <div className="sticky top-0 bg-white z-50">
          <Tools editor={editor} onImageSelection={() => setShowImageGallery(true)} />
        </div>
        <div className="flex-1">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
      <ImageGallery onSelect={onImageSelect} visible={showImageGallery} onClose={setShowImageGallery} />
    </>
  );
};

export default RichEditor;

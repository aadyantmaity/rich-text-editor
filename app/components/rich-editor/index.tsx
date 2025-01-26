"use client"

import { FC, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Tools from "./Tools";
import ImageGallery from "./ImageGallery";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';

interface Props {}

const extensions = [
  StarterKit,
  Underline,
  TextStyle,
  FontFamily.configure({
    types: ['textStyle'],
  }),
  Image.configure({
    inline: false,
    HTMLAttributes: {
      class: "w-[80%] mx-auto",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Color.configure({
    types: ['textStyle']
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
  CharacterCount.configure({
    wordCounter: (text) => text.split(/\s+/).filter((word) => word !== '').length,
  })
];

type PageSize = 'Letter' | 'A4' | 'A5' | 'A6';

const RichEditor: FC<Props> = () => {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("A4");

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl outline-none p-4 rounded-lg",
      },
    },
  });

  const onImageSelect = (image: string) => {
    editor?.chain().focus().setImage({ src: image, alt: "img" }).run();
  };

  const characterCount = editor?.storage.characterCount.characters() || 0;
  const wordCount = editor?.storage.characterCount.words() || 0;

  const pageSizeClasses: { [key in PageSize]: string } = {
    Letter: 'w-[816px] h-[1056px]',
    A4: 'w-[827px] h-[1169px]',
    A5: 'w-[583px] h-[827px]',
    A6: 'w-[410px] h-[583px]',
  };

  const handlePageSizeChange = (pageSize: string) => {
    setPageSize(pageSize as PageSize);
  };

  return (
    <>
      <div className="h-screen flex flex-col space-y-6">
        <div className="sticky top-0 bg-white z-50">
          <Tools editor={editor} onImageSelection={() => setShowImageGallery(true)} onPageSizeChange={handlePageSizeChange} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className={`${pageSizeClasses[pageSize]} mx-auto flex-1`}>
            <EditorContent editor={editor} className="h-full" />
          </div>
          <div className="mt-2 text-right text-sm text-gray-500">
            {wordCount} words | {characterCount} characters
          </div>
        </div>
      </div>
      <ImageGallery onSelect={onImageSelect} visible={showImageGallery} onClose={setShowImageGallery} />
    </>
  );
};

export default RichEditor;
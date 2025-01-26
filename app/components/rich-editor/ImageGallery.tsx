"use client"
import React, { FC, use, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FileUploader } from "react-drag-drop-files";
import { IoCloudUploadOutline } from "react-icons/io5";
import GalleryImage from "./GalleryImage";
import { uploadFile } from "@/app/actions/file";
import { useImages } from "@/app/context/ImageProvider";

interface Props {
  visible: boolean;
  onClose(state: boolean): void;
  onSelect?(src: string): void;
  onDelete?(src: string): void;
}

const ImageGallery: FC<Props> = ({ visible, onSelect, onClose }) => {
  const [isUploading, setIsUploading] = useState(false)
  const image = useImages()
  const images = image?.images
  const updateImages = image?.updateImages
  
  const handleClose = () => {
    onClose(!visible);
  };

  const handleSelection = (image: string) => {
    onSelect && onSelect(image);
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (visible) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      tabIndex={-1}
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="relative md:w-[760px] w-[80%] h-[80%] bg-white rounded-md p-4 overflow-y-auto">
        <div className="absolute right-4 top-4 p-2 z-50">
          <button onClick={handleClose}>
            <IoMdClose size={24} />
          </button>
        </div>
        <FileUploader
          handleChange={async (file: File) => {
            setIsUploading(true)
            try {
              const formData = new FormData()
              formData.append("file", file)
              const res = await uploadFile(formData)
              console.log(res);
              if(res && updateImages) {
                updateImages([res.secure_url])
              }
            } catch (error) {
              console.log(error)
            }
            setIsUploading(false)

          }}
          name="file"
          types={["png", "jpg", "jpeg", "webp"]}
        >
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <IoCloudUploadOutline />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Image Files
                </p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
        </FileUploader>

        {!images?.length ?  <p className="p-4 text-center text-2xl font-semibold opacity-45">
          No Images to Render
        </p> : null}
        
        <div className="grid gap-4 md:grid-cols-4 grid-cols-2 mt-4">
          {isUploading && (<div className="w-full aspect-square rounded animate-pulse bg-gray-200"></div>)}
          {images?.map((item) => {
            return (<GalleryImage onSelectClick={() => handleSelection(item)}
            src={item}/>);
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
"use client";

import { FC, useEffect, useState } from "react";
import { BiUnlink } from "react-icons/bi";

interface Props {
  initialState?: string;
  onSubmit(link: string): void;
}

const LinkEditForm: FC<Props> = ({ initialState, onSubmit }) => {
  const [link, setLink] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (initialState) setLink(initialState);
  }, [initialState]);

  const handleSubmit = (link: string) => {
    onSubmit(link);
    setShowForm(false);
  };

  return (
    <>
      {showForm && (
        <div className="absolute top-10 z-50 ring-1 ring-black p-2 rounded flex items-center shadow-sm bg-white outline-none">
          <input
            value={link}
            onChange={({ target }) => setLink(target.value)}
            type="text"
            className="outline-none"
            placeholder="https://url.com"
          />
          <button
            onMouseDown={() => handleSubmit(link)}
            className="bg-black text-white w-8 aspect-square flex justify-center items-center"
          >
            ok
          </button>
          <button
            onMouseDown={() => handleSubmit("")}
            className="bg-red-400 text-white w-8 aspect-square flex justify-center items-center"
          >
            <BiUnlink />
          </button>
        </div>
      )}
    </>
  );
};

export default LinkEditForm;

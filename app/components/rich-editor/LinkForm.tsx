"use client";

import { FC, useState } from "react";
import ToolButton from "./ToolButton";
import { BiLink } from "react-icons/bi";

interface Props {
  onSubmit(link: string): void;
}

const LinkForm: FC<Props> = ({ onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [link, setLink] = useState("");

  const handleSubmit = () => {
    if (link.trim() !== "") {
      onSubmit(link);
      setLink("");
      setShowForm(false);
    }
  };

  return (
    <div>
      <ToolButton onClick={() => setShowForm(true)}>
        <BiLink size={20} />
      </ToolButton>
      {showForm && (
        <div className="absolute top-10 z-50 ring-1 ring-black p-2 rounded flex items-center shadow-sm bg-white outline-none">
          <input
            value={link}
            onChange={({ target }) => setLink(target.value)}
            onBlur={() => setShowForm(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            type="text"
            className="outline-none"
            placeholder="https://url.com"
          />
          <button
            onMouseDown={handleSubmit}
            className="bg-white ml-1"
          >
            ok
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkForm;

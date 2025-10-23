"use client";

import { useState } from "react";
import TextInputField from "./text-input-field";

interface DescriptionInputProps {
  title: string;
  onSubmit: (description: string) => void;
}

const DescriptionInput = ({ title, onSubmit }: DescriptionInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto space-y-4">
      {/* Disabled TextInputField to display the title */}
      <TextInputField
        value={title}
        onChange={() => {}}
        placeholder="Task Title"
        onSubmit={() => {}}
        disabled={true}
      />
      <TextInputField
        value={value}
        onChange={setValue}
        placeholder="Enter task description..."
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DescriptionInput;
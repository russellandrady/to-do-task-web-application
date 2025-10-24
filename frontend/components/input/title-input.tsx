"use client";

import { useState } from "react";
import TextInputField from "./text-input-field";

interface TitleInputProps {
  onSubmit: (title: string) => void;
}

const TitleInput = ({ onSubmit }: TitleInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <TextInputField
      value={value}
      onChange={setValue}
      placeholder="Enter task title..."
      onSubmit={handleSubmit}
      testId="task-title-input"
    />
  );
};

export default TitleInput;
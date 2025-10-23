"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import TitleInput from "./input/title-input";
import DescriptionInput from "./input/description-input";
import type { TaskBase } from "../../types/task";
import useTaskStore from "@/store/taskStore";
import { useMutation } from "@tanstack/react-query";
import { createTaskService } from "@/api/service";

type Step = "initial" | "title" | "description";

const TodoButton = () => {
  const [step, setStep] = useState<Step>("initial");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //mutations

  const createTaskMutation = useMutation({
    mutationFn: createTaskService,
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setStep("initial");
    },
  });

  //handling functions

  const handleAddClick = () => {
    setStep("title");
  };

  const handleTitleSubmit = (titleValue: string) => {
    setTitle(titleValue);
    setStep("description");
  };

  const handleDescriptionSubmit = (descriptionValue: string) => {
    setDescription(descriptionValue);
    const newTask: TaskBase = {
      title,
      description: descriptionValue,
    };
    createTaskMutation.mutate(newTask);
  };

  return (
    <div className="space-y-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "initial" && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={handleAddClick} className="btn-outline">
              <div className="btn-inline h-9">
                <Plus size={24} />
              </div>
            </button>
          </motion.div>
        )}

        {step === "title" && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TitleInput onSubmit={handleTitleSubmit} />
          </motion.div>
        )}

        {step === "description" && (
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DescriptionInput
              title={title}
              onSubmit={handleDescriptionSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodoButton;

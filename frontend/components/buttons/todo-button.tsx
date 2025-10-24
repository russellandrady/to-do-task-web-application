"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import TitleInput from "../input/title-input";
import DescriptionInput from "../input/description-input";
import type { TaskBase } from "../../types/task";
import useTaskStore from "@/store/taskStore";
import { useMutation } from "@tanstack/react-query";
import { createTaskService } from "@/api/service";
import AnimatedWrapper from "../animation/animated-wrapper";

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
      title: title.trim(),
      description: descriptionValue.trim(),
    };
    createTaskMutation.mutate(newTask);
  };

  return (
    <motion.div
    className="space-y-8 overflow-hidden"
    animate={{
      height: step === "initial" ? "3rem" : step === "title" ? "3rem" : "6rem", 
    }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }} 
  >
      <AnimatePresence mode="wait">
        {step === "initial" && (
          <AnimatedWrapper keyProp="initial">
            <button data-testid="create-task-btn" onClick={handleAddClick} className="btn-outline">
              <div className="btn-inline h-9">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Plus size={24} />
                </motion.div>
              </div>
            </button>
          </AnimatedWrapper>
        )}

        {step === "title" && (
          <AnimatedWrapper keyProp="title">
            <TitleInput onSubmit={handleTitleSubmit} />
          </AnimatedWrapper>
        )}

        {step === "description" && (
          <AnimatedWrapper keyProp="description">
            <DescriptionInput
              title={title}
              onSubmit={handleDescriptionSubmit}
            />
          </AnimatedWrapper>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TodoButton;

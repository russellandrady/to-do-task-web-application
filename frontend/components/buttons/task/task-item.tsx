"use client";

import { Task } from "@/types/task";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { markTaskAsCompletedService } from "@/api/service";

const TaskItem = ({ id, title, description, completed }: Task) => {
  const mutation = useMutation({
    mutationFn: () => markTaskAsCompletedService(id),
  });
  return (
    <div className="task-item min-h-27 relative p-4 items-start justify-start">
      {/* Title and Description */}
      <div className="text-left">
        <div className="font-semibold">{title}</div>
        <div className="text-xs">{description}</div>
      </div>

      {/* Done Button */}
      {!completed && <motion.button
        onClick={() => mutation.mutate()}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-lavender-500 px-4 py-2 rounded-xl opacity-50 hover:opacity-100 transition"
        whileHover="hover"
        initial="initial"
        animate="initial"
      >
        <motion.div
          className="icon mr-2"
          variants={{
            initial: { opacity: 1, x: 0 },
            hover: { opacity: 0, x: -10 },
          }}
          transition={{ duration: 0.2 }}
        >
          <Check size={10} />
        </motion.div>

        <motion.div
          className="text-xs"
          variants={{
            initial: { x: 0 },
            hover: { x: -10 },
          }}
          transition={{ duration: 0.2 }}
        >
          Done
        </motion.div>
      </motion.button>}
    </div>
  );
};

export default TaskItem;

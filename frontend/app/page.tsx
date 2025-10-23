import TaskItemList from "@/components/task/task-item-list";
import TodoButton from "@/components/buttons/todo-button";

export default function Home() {
  return (
    <div className="grid bg-background p-4 m-2 rounded-2xl grid-cols-1 items-start gap-4">
      <TodoButton />
      <TaskItemList />
    </div>
  );
}

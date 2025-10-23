import TodoButton from "@/components/buttons/todo-button";
import Image from "next/image";

export default function Home() {
  
  return (
    <div className="grid min-h-screen bg-lavender-200">
      <div className="grid bg-background p-4 m-2 rounded-2xl">
         <TodoButton />
      </div>
    </div>
  );
}
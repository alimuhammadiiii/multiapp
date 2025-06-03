import { createFileRoute, Link } from "@tanstack/react-router";
import Todos from "../components/TodosList";
import AddTodo from "../components/addTodo";
import { IoMdHome } from "react-icons/io";

export const Route = createFileRoute("/todoApp")({
  component: TodoApp,
});

function TodoApp() {
  return (
    <div className=" bg-[url(assets/coverTodos.jpg)] bg-cover flex flex-col justify-between p-4 gap-4  h-full">
      <div className="flex items-center justify-start text-3xl gap-2">
        <div className="flex items-center">
          <Link to="/">
            {" "}
            <IoMdHome size={50} />
          </Link>{" "}
        </div>
      </div>
      <Todos />
      <AddTodo />
    </div>
  );
}

import { IoMdAdd, IoMdHome } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  useMutationAddTodo,
  useQueryTodos,
  useMutationDeleteTodo,
  useMutationEditTodo,
} from "../Api/useTodosData";
import { toast } from "react-toastify";
import type { Todo } from "../Api/useTodosData";
import { useDebounce } from "../components/useDebounce";
import { TbSortAscending } from "react-icons/tb";
import { PiSortAscending } from "react-icons/pi";
interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onComplete: () => void;
}
export const Route = createFileRoute("/todoApp")({
  component: TodoApp,
});

function TodoApp() {
  return (
    <>
      <div className="grid grid-cols-[1fr] grid-rows-[1fr] gap-y-[10px]  h-full">
        {/* <div className="bg-gray-800 text-2xl text-white flex flex-col justify-center items-center">
          Sidebar
        </div> */}

        <div className=" bg-[url(assets/coverTodos.jpg)] bg-cover flex flex-col justify-between p-4 gap-4">
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
      </div>
    </>
  );
}

function AddTodo() {
  const [text, setText] = useState("");
  const mutation = useMutationAddTodo();
  function handleAddTodo() {
    if (text === "") {
      return toast.warn("please fill input", { autoClose: 5000 });
    }

    mutation.mutate({
      id: crypto.randomUUID(),
      text: text,
      isComplete: false,
      isEditable: false,
      date: new Date(),
    });
    setText("");
  }

  return (
    <>
      <div className="bg-white/30 backdrop-blur-md flex gap-3 rounded h-10">
        <button
          onClick={handleAddTodo}
          type="button"
          className="bg-inherit add-bottom cursor-pointer h-full w-10 flex justify-center items-center"
        >
          <IoMdAdd size={20} />
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add Todo..."
          type="text"
          className="grow h-full outline-none text-black placeholder:text-black"
        />
      </div>
    </>
  );
}

function Todos() {
  const todoQuery = useQueryTodos();
  const [sortby, setSortby] = useState<"date" | "text">("date");
  const [sortDirection, setSortDirection] = useState<"desc" | "ascend">("ascend");
  const todos = useMemo(() => {
    const sorted = todoQuery.data?.toSorted((a, b) => {
      let sortA = a;
      let sortB = b;

      if (sortDirection === "desc") {
        sortA = b;
        sortB = a;
      }
      if (sortby === "date") {
        return sortA.date.getTime() - sortB.date.getTime();
      }
      if (sortby === "text") {
        return sortA.text.localeCompare(sortB.text);
      }

      return 0;
    });

    return sorted;
  }, [sortDirection, sortby, todoQuery.data]);
  const mutateDeleteTodo = useMutationDeleteTodo();
  const mutateEditTodo = useMutationEditTodo();

  console.log(todos);

  if (todoQuery.status === "pending") {
    return "Loading...";
  }

  if (todoQuery.status === "error") {
    return "ERROR: " + todoQuery.error.message;
  }

  return (
    <>
      <div className="flex justify-start items-center gap-6">
        {sortDirection === "desc" ? (
          <button onClick={() => setSortDirection("ascend")}>
            <TbSortAscending />
          </button>
        ) : (
          <button onClick={() => setSortDirection("desc")}>
            <PiSortAscending />
          </button>
        )}

        <div className="flex justify-center gap-1 items-center">
          <label>Sort By</label>
          <select
            className="bg-[#787878] "
            value={sortby}
            onChange={(e) => setSortby(e.target.value as "date" | "text")}
          >
            <option value="date">Date</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>
      <ul className="grow flex flex-col gap-3.5">
        {todos?.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={mutateDeleteTodo.mutate}
            onEdit={mutateEditTodo.mutate}
            onComplete={() => {
              mutateEditTodo.mutate({ ...todo, isComplete: !todo.isComplete });
            }}
          />
        ))}
      </ul>
    </>
  );
}

function TodoItem({ todo, onDelete, onEdit, onComplete }: TodoItemProps) {
  const [text, setText] = useState(todo.text);
  const debounced = useDebounce(text, 1000);

  useEffect(() => {
    if (debounced !== todo.text) {
      onEdit({ ...todo, text: debounced });
    }
  }, [debounced, onEdit, todo]);
  return (
    <li className="flex bg-white/30 backdrop-blur-md justify-center items-center gap-2  rounded  p-1.5">
      <input
        onChange={onComplete}
        checked={todo.isComplete}
        type="checkbox"
        className="w-6 h-6 m-0"
      />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`grow h-10 w-full outline-0 ${todo.isComplete && "line-through"}`}
        type="text"
      />
      <button onClick={() => onDelete(todo.id)} className="flex justify-center items-center">
        <MdDelete size={25} />
      </button>
    </li>
  );
}

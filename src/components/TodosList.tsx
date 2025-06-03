import { MdDelete } from "react-icons/md";
import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "../components/useDebounce";
import { TbSortAscending } from "react-icons/tb";
import { PiSortAscending } from "react-icons/pi";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getTodos,
  useMutationDeleteTodo,
  useMutationEditTodo,
} from "../Api/useTodosData";
import type { Todo } from "../Api/useTodosData";
import FilterTodos from "./filterTodo";
import { useInView } from "react-intersection-observer";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onComplete: () => void;
}

export default function Todos() {
  const [ref, inView] = useInView();
  const [sortby, setSortby] = useState<"date" | "text">("date");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("asc");
  const [filter, setFilter] = useState<"default" | "inProgress" | "complete">(
    "default"
  );

  const {
    isLoading,
    data,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: ({ pageParam = 1 }) => getTodos({ pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.next === null) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const mutateDeleteTodo = useMutationDeleteTodo();
  const mutateEditTodo = useMutationEditTodo();

  const todos = useMemo(() => {
    const allTodos: Todo[] =
      data?.pages.flatMap((page) => page.data.data) ?? [];

    const sorted = [...allTodos].sort((a, b) => {
      let sortA = a;
      let sortB = b;

      if (sortDirection === "desc") {
        sortA = b;
        sortB = a;
      }

      if (sortby === "date") {
        return new Date(sortA.date).getTime() - new Date(sortB.date).getTime();
      }

      if (sortby === "text") {
        return sortA.text.localeCompare(sortB.text);
      }

      return 0;
    });

    const filtered = sorted.filter((todo) => {
      if (filter === "inProgress") return !todo.isComplete;
      if (filter === "complete") return todo.isComplete;
      return true;
    });

    return filtered;
  }, [data?.pages, sortby, sortDirection, filter]);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return "Loading...";
  if (isError) return `ERROR: ${error.message}`;

  return (
    <>
      {/* Toolbar */}
      <div className="flex justify-start items-center gap-6">
        {sortDirection === "desc" ? (
          <button onClick={() => setSortDirection("asc")}>
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
            className="bg-[#787878]"
            value={sortby}
            onChange={(e) => setSortby(e.target.value as "date" | "text")}
          >
            <option value="date">Date</option>
            <option value="text">Text</option>
          </select>

          <FilterTodos filter={filter} onChangeValue={setFilter} />
        </div>
      </div>

      {/* Todos List */}
      <ul className="grow overflow-y-auto flex flex-col gap-2 p-4 mb-14">
        {todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={mutateDeleteTodo.mutate}
            onEdit={mutateEditTodo.mutate}
            onComplete={() =>
              mutateEditTodo.mutate({ ...todo, isComplete: !todo.isComplete })
            }
          />
        ))}
        <div ref={ref} className="h-0.5"></div>
      </ul>

      <div>
        <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          load more
        </button>
      </div>
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
      <button
        onClick={() => onDelete(todo.id)}
        className="flex justify-center items-center"
      >
        <MdDelete size={25} />
      </button>
    </li>
  );
}

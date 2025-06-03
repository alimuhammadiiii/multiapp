import { useState } from "react";
import { useMutationAddTodo } from "../Api/useTodosData";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";

export default function AddTodo() {
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
          className="bg-inherit add-bottom cursor-pointer  w-10 flex justify-center items-center h-10"
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

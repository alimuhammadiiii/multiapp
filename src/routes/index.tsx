import { createFileRoute, Link } from "@tanstack/react-router";
import { FcTodoList } from "react-icons/fc";
import { SiTheweatherchannel } from "react-icons/si";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex justify-center items-center h-full bg-[url(assets/bg-home.svg)] bg-contain">
      <div className="p-2 flex gap-2 flex-wrap h-64 w-64">
        <Link
          to="/"
          className=" h-28 w-28 rounded  bg-[#f4f0f0]  flex items-center justify-center flex-col text-black"
        >
          <SiTheweatherchannel size={80} />
          coming soon..
        </Link>{" "}
        <Link
          to="/about"
          className="[&.active]:font-bold h-28 w-28 rounded bg-[#f4f0f0] flex items-center justify-center"
        >
          <p className="font-bold">AboutUs</p>
        </Link>
        <Link
          to="/todoApp"
          className="font-bold h-28 w-28 rounded bg-[#f4f0f0] [&.active]:text-[#535bf2] flex items-center justify-center flex-col"
        >
          <FcTodoList size={80} />
          TodoApp
        </Link>
        <Link
          to="/"
          className=" h-28 w-28 rounded  flex-col bg-white flex items-center justify-center"
        >
          <div className="w-23 h-23 bg-[url(assets/Tic-Tac-Toe.jpg)] bg-contain bg-no-repeat"></div>
          coming soon..
        </Link>
      </div>
      <hr />
    </div>
  );
}

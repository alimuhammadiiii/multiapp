import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";

type User = {
  id: string;
  name: string;
};

function getUsers({ pageParam = 1 }) {
  return axios
    .get(`http://localhost:4000/users`, {
      params: {
        _page: pageParam,
        _per_page: 10,
      },
    })
    .then((res) => res);
}

export const Route = createFileRoute("/users")({
  component: Users,
});

function Users() {
  const { ref, inView } = useInView();
  const {
    isLoading,
    data,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam = 1 }) => getUsers({ pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.next === null) {
        return undefined;
      } else {
        return pages.length + 1;
      }
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  //   useEffect(() => {
  //     const el = containerRef.current;
  //     if (!el) return;

  //     const handleScroll = () => {
  //       if (
  //         el.scrollTop + el.clientHeight >= el.scrollHeight - 10 &&
  //         hasNextPage &&
  //         !isFetchingNextPage
  //       ) {
  //         fetchNextPage();
  //       }
  //     };

  //     el.addEventListener("scroll", handleScroll);
  //     return () => el.removeEventListener("scroll", handleScroll);
  //   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <div className="m-auto w-full">
      <h1>Users</h1>
      <div className="w-[200px] h-[200px] overflow-auto m-auto">
        {data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.data.map((user: User) => (
              <p key={user.id}>{user.name}</p>
            ))}
          </React.Fragment>
        ))}
        <div ref={ref} style={{ height: "1px" }}></div>
      </div>
      <div>
        <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          load more
        </button>
      </div>
    </div>
  );
}

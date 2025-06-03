import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export type Todo = {
  id: string;
  text: string;
  isEditable: boolean;
  isComplete: boolean;
  date: Date;
};

export const useMutationAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTodo: Todo) => {
      return axios.post("http://localhost:4000/todos", newTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success(` added Todo`, { autoClose: 5000 });
    },
    onError(error) {
      return toast.error(error.message, { autoClose: 5000 });
    },
  });
};

export const useMutationDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`http://localhost:4000/todos/${id}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      return toast.error(` delete Todo`, { autoClose: 5000 });
    },
    onError(error) {
      return toast.error(error.message, { autoClose: 5000 });
    },
  });
};

export const useMutationEditTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todo: Todo) => {
      return axios.patch(`http://localhost:4000/todos/${todo.id}`, todo);
    },
    onSuccess() {
      return queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError(error) {
      return toast.error(error.message, { autoClose: 5000 });
    },
  });
};

export function getTodos({ pageParam = 1 }) {
  return axios
    .get(`http://localhost:4000/todos`, {
      params: {
        _page: pageParam,
        _per_page: 10,
      },
    })
    .then((res) => res);
}

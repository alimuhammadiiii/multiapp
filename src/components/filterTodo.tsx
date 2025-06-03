export default function FilterTodos({
  filter,
  onChangeValue,
}: {
  filter: string;
  onChangeValue: (value: "default" | "inProgress" | "complete") => void;
}) {
  return (
    <>
      <label>filter</label>
      <select
        value={filter}
        onChange={(e) =>
          onChangeValue(e.target.value as "default" | "inProgress" | "complete")
        }
      >
        <option value="default">Default</option>
        <option value="inProgress">In Progress</option>
        <option value="complete">Complete</option>
      </select>
    </>
  );
}

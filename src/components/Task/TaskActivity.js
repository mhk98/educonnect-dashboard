// import { useGetTaskActivityQuery } from "../../features/taskComment/taskComment";

import { useGetTaskActivityQuery } from "../../features/taskActivity/taskActivity";

function TaskActivity({ taskId }) {
  const { data } = useGetTaskActivityQuery(taskId);

  console.log("taskActivity", data);
  console.log("taskId", taskId);

  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">Activity</h4>

      <ul className="space-y-2 text-sm">
        {data?.data?.map((a) => (
          <li key={a.id} className="text-gray-700">
            <b>
              {a.User?.FirstName} {a.User?.LastName}
            </b>{" "}
            {a.action.replace("_", " ").toLowerCase()}
            {a.from_value && (
              <span className="text-xs text-gray-500">
                {" "}
                ({a.from_value} → {a.to_value})
              </span>
            )}
            <div className="text-[11px] text-gray-400">
              {new Date(a.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskActivity;

import React from "react";

export default function Select(props) {
  return (
    <div className="flex flex-col mr-2">
      <label htmlFor={props.name} className="mt-4">
        {props.label}
      </label>
      <select
        name="select"
        {...props}
        className="border rounded shadow-md mt-2 h-10 px-1 focus:outline-none focus:border-blue-600 focus:border-2 bg-white"
      >
        {props.options.map((item, index) => (
          <option key={`select-${index}-${item.label}`} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

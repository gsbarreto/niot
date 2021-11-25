import React from "react";

export default function Input(props) {
  return (
    <div className="flex flex-col">
      <label htmlFor={props.name} className="mt-4">
        {props.label}
      </label>
      <input
        {...props}
        className="border rounded shadow-md mt-2 h-10 px-1 focus:outline-none focus:border-blue-600 focus:border-2"
      />
    </div>
  );
}

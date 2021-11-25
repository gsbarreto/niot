import React from "react";

export default function Checkbox(props) {
  return (
    <div className="flex flex-row mt-4 items-center">
      <input type="checkbox" {...props} />
      <label htmlFor={props.name} className=" ml-4">
        {props.label}
      </label>
    </div>
  );
}

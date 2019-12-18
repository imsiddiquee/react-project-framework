import React from "react";

const CheckBox = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-check">
      <input {...rest} id={name} name={name} className="form-check-input" />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default CheckBox;

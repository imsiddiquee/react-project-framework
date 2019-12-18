import React, { Component } from "react";
import { Link } from "react-router-dom";
import Progress from "react-progress-2";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import CheckBox from "./checkbox";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    console.log("error", errors);
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    try {
      Progress.show();

      e.preventDefault();

      const errors = this.validate();

      this.setState({ errors: errors || {} });
      if (errors) return;

      this.doSubmit();

      Progress.hide();
    } catch (error) {
      Progress.hideAll();
    }
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };

    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleSelectionChange = (e, bindCurrentFunction) => {
    this.handleChange(e);
    bindCurrentFunction(e);
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderBackButton(label) {
    return (
      <button
        className="btn btn-light m-2"
        onClick={e => {
          e.preventDefault();
          this.props.history.goBack();
          return;
        }}
      >
        {label}
      </button>
    );
  }

  renderNewButton(pathTo, label) {
    return (
      <Link
        to={pathTo}
        className="btn btn-success"
        style={{ marginBottom: 20 }}
      >
        {label}
      </Link>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
  renderSelectWithEvent(name, label, options, currentFunction) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={e => this.handleSelectionChange(e, currentFunction)}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type = "text", autoFocus = false) {
    const { data, errors } = this.state;

    return (
      <Input
        autoFocus={autoFocus}
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderDisabledInput(
    name,
    label,
    type = "text",
    autoFocus = false,
    disabled = true
  ) {
    const { data, errors } = this.state;

    return (
      <Input
        autoFocus={autoFocus}
        type={type}
        name={name}
        value={data[name]}
        label={label}
        disabled={disabled}
        error={errors[name]}
      />
    );
  }

  renderCheckbox(name, label, type = "checkbox") {
    const { data, errors } = this.state;

    return (
      <CheckBox
        type={type}
        name={name}
        value={data[name]}
        checked={data[name]}
        label={label}
        onChange={e => {
          e.currentTarget.value = e.currentTarget.checked;
          this.handleChange(e);
        }}
        error={errors[name]}
      />
    );
  }
}

export default Form;

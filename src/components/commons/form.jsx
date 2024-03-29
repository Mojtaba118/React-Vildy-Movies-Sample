import React, { Component } from "react";
import Input from "./input";
import Joi from "joi-browser";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };
  validate = () => {
    const { data } = this.state;
    const options = { abortEarly: false };
    const result = Joi.validate(data, this.schema, options);
    if (!result.error) return null;
    const errors = {};
    for (let error of result.error.details) {
      errors[error.path[0]] = error.message;
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit(e);
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

  renderButton = label => (
    <button disabled={this.validate()} className="btn btn-primary">
      {label}
    </button>
  );

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;
    return (
      <Input
        error={errors[name]}
        name={name}
        label={label}
        value={data[name]}
        onChange={this.handleChange}
        type={type}
      />
    );
  };

  renderSelect = (name, label, items, selectedItem = "") => {
    return (
      <Select
        name={name}
        label={label}
        items={items}
        error={this.state.errors[name]}
        selectedItem={selectedItem}
        onChange={this.handleChange}
      />
    );
  };
}

export default Form;

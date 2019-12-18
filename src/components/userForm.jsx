import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { toast } from "react-toastify";
import { getUser, saveUser } from "../services/userService";

class UserForm extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: "",
      isAdmin: false
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label("User name"),
    email: Joi.string()
      .required()
      .label("Email"),
    password: Joi.string()
      .required()
      .label("Password"),
    isAdmin: Joi.boolean()
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      if (userId === "new") return;

      const { data: user } = await getUser(userId);
      this.setState({ data: this.mapToViewModel(user) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin || false
    };
  }

  async componentDidMount() {
    await this.populateUser();
  }

  doSubmit = async () => {
    try {
      await saveUser(this.state.data);
      toast.success("User created");

      this.props.history.push("/users");
    } catch (error) {
      toast.error("Server end problem.");
    }
  };
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">User Form</h1>
          <hr />
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "User name", "text", true)}
            {this.renderInput("email", "Email", "email")}
            {this.renderInput("password", "Password", "password")}
            {this.renderCheckbox("isAdmin", "Is Admin", "checkbox")}

            <hr />
            {this.renderButton("Save")}
            {this.renderBackButton("back")}
          </form>
        </div>
      </div>
    );
  }
}

export default UserForm;

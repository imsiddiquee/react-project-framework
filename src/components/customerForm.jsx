import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { toast } from "react-toastify";
import { getCustomer, saveCustomer } from "../services/customerService";

class CustomerForm extends Form {
  state = {
    data: {
      name: "",
      isGold: false,
      phone: ""
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Customer name"),
    isGold: Joi.boolean(),
    phone: Joi.string()
      .required()
      .label("Customer phone")
  };

  async populateCustomer() {
    try {
      const customerId = this.props.match.params.id;
      if (customerId === "new") return;

      const { data: customer } = await getCustomer(customerId);
      this.setState({ data: this.mapToViewModel(customer) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(customer) {
    return {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone
    };
  }

  async componentDidMount() {
    await this.populateCustomer();
  }

  doSubmit = async () => {
    try {
      await saveCustomer(this.state.data);
      toast.success("Customer created");

      this.props.history.push("/customers");
    } catch (error) {
      toast.error("Server end problem.");
    }
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Customer Form</h1>
          <hr />
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Customer name", "text", true)}
            {this.renderCheckbox("isGold", "Is gold", "checkbox")}
            {this.renderInput("phone", "Phone")}

            <hr />
            {this.renderButton("Save")}
            {this.renderBackButton("back")}
          </form>
        </div>
      </div>
    );
  }
}

export default CustomerForm;

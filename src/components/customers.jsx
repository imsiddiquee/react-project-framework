import React from "react";
import { toast } from "react-toastify";
import Form from "./common/form";
import { getCustomers, deleteCustomer } from "../services/customerService";
import { Link } from "react-router-dom";

class Customers extends Form {
  state = {
    customers: []
  };

  async populateCustomers() {
    const { data: customers } = await getCustomers();
    console.log(customers);

    this.setState({ customers: customers });
  }

  async componentDidMount() {
    await this.populateCustomers();
  }

  handleDelete = async post => {
    const originalCustomers = this.state.customers;
    const customers = originalCustomers.filter(g => g._id !== post._id);
    this.setState({ customers: customers });

    try {
      await deleteCustomer(post._id);
      toast.info("Data delete successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This genre has already been deleted.");

      this.setState({ customers: originalCustomers });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row card">
          <div className="card-body">
            <h1 className="card-title">Customers</h1>
            {this.renderNewButton("/customers/new", "New customer")}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Is gold</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.customers.map(post => (
                  <tr key={post._id}>
                    <td>
                      <Link to={`/customers/${post._id}`}>{post.name}</Link>
                    </td>
                    <td>{post.isGold ? "Yes" : "No"}</td>
                    <td>{post.phone}</td>
                    <td>
                      <Link
                        className="btn btn-sm btn-info mx-2"
                        to={`/customers/${post._id}`}
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => this.handleDelete(post)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Customers;

import React from "react";
import { toast } from "react-toastify";
import Form from "./common/form";
import { getRentals, deleteRental } from "../services/rentalService";
import { Link } from "react-router-dom";

class RentalsForm extends Form {
  state = {
    rentals: []
  };

  async populateRentals() {
    const { data: rentals } = await getRentals();

    this.setState({ rentals: rentals });
  }

  async componentDidMount() {
    await this.populateRentals();
  }

  handleDelete = async post => {
    const originalRentals = this.state.rentals;
    const rentals = originalRentals.filter(g => g._id !== post._id);
    this.setState({ rentals: rentals });

    try {
      await deleteRental(post._id);
      toast.info("Data delete successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This rental has already been deleted.");

      this.setState({ rentals: originalRentals });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row card">
          <div className="card-body">
            <h1 className="card-title">Rentals</h1>
            {this.renderNewButton("/rentals/new", "Rental")}
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Is gold</th>
                  <th>Phone</th>
                  <th>Movie</th>
                  <th>Rental rate</th>
                  <th>Rental fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.rentals.map(post => (
                  <tr key={post._id}>
                    <td>
                      <Link to={`/rentals/${post._id}`}>
                        {post.customer.name}
                      </Link>
                    </td>
                    <td>{post.customer.isGold ? "Yes" : "No"}</td>
                    <td>{post.customer.phone}</td>
                    <td>{post.movie.title}</td>
                    <td>{post.movie.dailyRentalRate}</td>
                    <td>{post.rentalFee}</td>
                    <td>
                      <Link
                        className="btn btn-sm btn-info mx-2"
                        to={`/rentals/${post._id}`}
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

export default RentalsForm;

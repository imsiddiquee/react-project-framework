import React from "react";
import _ from "underscore";
import Joi from "joi-browser";
import Form from "./common/form";
import { toast } from "react-toastify";
import { getRental, saveRental } from "../services/rentalService";
import { getCustomers, getCustomer } from "../services/customerService";
import { getMovies, getMovie } from "../services/movieService";

class RentalForm extends Form {
  state = {
    data: {
      customerId: "",
      movieId: "",
      isGold: false,
      phone: "",
      dailyRentalRate: 0
    },
    customers: [],
    movies: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    customerId: Joi.string()
      .required()
      .label("Customer"),
    movieId: Joi.string()
      .required()
      .label("Movie"),
    isGold: Joi.boolean(),
    phone: Joi.string().allow(""),
    dailyRentalRate: Joi.number(),
    rentalFee: Joi.number().allow("")
  };

  async populateRental() {
    try {
      const rentalId = this.props.match.params.id;
      if (rentalId === "new") return;

      const { data: rental } = await getRental(rentalId);
      console.log("rental", rental);

      this.setState({ data: this.mapToViewModel(rental) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(rental) {
    return {
      _id: rental._id,
      customerId: rental.customer._id,
      isGold: rental.customer.isGold,
      phone: rental.customer.phone,
      movieId: rental.movie._id,
      dailyRentalRate: rental.movie.dailyRentalRate,
      rentalFee: rental.rentalFee
    };
  }

  async populateCustomer() {
    try {
      const { data: customers } = await getCustomers();

      var result = _.map(customers, function(currentObject) {
        return _.pick(currentObject, "_id", "name");
      });

      this.setState({ customers: result });
    } catch (error) {}
  }
  async populateMovies() {
    try {
      const { data: movies } = await getMovies();

      let result = _.map(movies, function(currentObject) {
        return _.pick(currentObject, "_id", "title");
      });

      result = result.map(value => {
        value.name = value.title;
        return value;
      });

      this.setState({ movies: result });
    } catch (error) {}
  }

  async componentDidMount() {
    await this.populateRental();
    await this.populateCustomer();
    await this.populateMovies();
  }

  doSubmit = async () => {
    try {
      const { customerId, movieId, rentalFee, _id = "" } = this.state.data;

      let rental = {
        customerId,
        movieId,
        rentalFee,
        _id
      };
      if (!rental._id) {
        delete rental._id;
      }

      await saveRental(rental);

      toast.success("Rental created");

      this.props.history.push("/rentals");
    } catch (error) {
      toast.error("Server end problem.");
    }
  };

  doMovieChange = async ({ currentTarget: input }) => {
    let currentData = { dailyRentalRate: 0, movieId: input.value };

    if (input.value) {
      const { data: movie } = await getMovie(input.value);
      currentData.dailyRentalRate = movie.dailyRentalRate;
    }

    const data = {
      ...this.state.data,
      dailyRentalRate: currentData.dailyRentalRate,
      movieId: currentData.movieId
    };

    this.setState({ data });
  };

  doCustomerChange = async ({ currentTarget: input }) => {
    let currentData = { phone: "", isGold: false, customerId: input.value };

    if (input.value) {
      const { data: customer } = await getCustomer(input.value);
      currentData.phone = customer.phone;
      currentData.isGold = customer.isGold;
    }

    const data = {
      ...this.state.data,
      phone: currentData.phone,
      isGold: currentData.isGold,
      customerId: currentData.customerId
    };

    this.setState({ data });
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Rental Form</h1>
          <hr />
          <form onSubmit={this.handleSubmit}>
            {this.renderSelectWithEvent(
              "customerId",
              "Customer",
              this.state.customers,
              this.doCustomerChange
            )}

            {this.renderCheckbox("isGold", "Is Gold")}
            {this.renderDisabledInput("phone", "Phone")}

            {this.renderSelectWithEvent(
              "movieId",
              "Movie",
              this.state.movies,
              this.doMovieChange
            )}
            {this.renderDisabledInput(
              "dailyRentalRate",
              "Daily Rental Rate",
              "number"
            )}
            <hr />
            {this.renderButton("Save")}
            {this.renderBackButton("back")}
          </form>
        </div>
      </div>
    );
  }
}

export default RentalForm;

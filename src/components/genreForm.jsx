import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { toast } from "react-toastify";
import { getGenre, saveGenre } from "../services/genreService";

class GenreForm extends Form {
  state = {
    data: {
      name: ""
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label("User name")
  };

  async populateGenre() {
    try {
      const genreId = this.props.match.params.id;
      if (genreId === "new") return;

      const { data: genre } = await getGenre(genreId);
      this.setState({ data: this.mapToViewModel(genre) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(user) {
    return {
      _id: user._id,
      name: user.name
    };
  }

  async componentDidMount() {
    await this.populateGenre();
  }

  doSubmit = async () => {
    try {
      await saveGenre(this.state.data);
      toast.success("User created");

      this.props.history.push("/genres");
    } catch (error) {
      toast.error("Server end problem.");
    }
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Genre Form</h1>
          <hr />
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Genre name", "text", true)}

            <hr />
            {this.renderButton("Save")}
            {this.renderBackButton("back")}
          </form>
        </div>
      </div>
    );
  }
}

export default GenreForm;

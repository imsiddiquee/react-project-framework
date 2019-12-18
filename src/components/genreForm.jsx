import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { toast } from "react-toastify";
import { getGenre, saveGenre, fileUpload } from "../services/genreService";

class GenreForm extends Form {
  state = {
    data: {
      name: ""
    },
    errors: {},
    imagePreviewUrl: null
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

  populateUploadPicture = event => {
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  populateStoreUploadPicture = async event => {
    const fileData = new FormData();
    fileData.append("file", event.target.files[0]);
    const { status, data } = await fileUpload(fileData);
    console.log("response", data.filename);
  };

  fileChangedHandler = async event => {
    this.populateUploadPicture(event);
    this.populateStoreUploadPicture(event);
  };

  render() {
    let $imagePreview = (
      <p className="previewText image-container small strong">
        Please select an Image for Preview
      </p>
    );
    if (this.state.imagePreviewUrl) {
      $imagePreview = (
        <div className="image-container">
          <img
            src={this.state.imagePreviewUrl}
            className="img-thumbnail img-fluid"
            alt="icon"
            width="100"
          />
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Genre Form</h1>
          <hr />

          {/* <div className="upload-pics">
            {$imagePreview}
            <div className="form-group">
              <input
                type="file"
                className="avatar"
                onChange={this.fileChangedHandler}
              />
            </div>
          </div> */}

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

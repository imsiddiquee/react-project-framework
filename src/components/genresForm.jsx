import React from "react";
import { toast } from "react-toastify";
import Form from "./common/form";
import { getGenres, deleteGenre } from "../services/genreService";
import { Link } from "react-router-dom";

class GenresForm extends Form {
  state = {
    genres: []
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres: genres });
  }

  async componentDidMount() {
    await this.populateGenres();
  }

  handleDelete = async post => {
    const originalGenres = this.state.genres;
    const genres = originalGenres.filter(g => g._id !== post._id);
    this.setState({ genres: genres });

    try {
      await deleteGenre(post._id);
      toast.info("Data delete successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This genre has already been deleted.");

      this.setState({ genres: originalGenres });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row card">
          <div className="card-body">
            <h1 className="card-title">Genres</h1>
            {this.renderNewButton("/genres/new", "New genre")}
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.genres.map(post => (
                  <tr key={post._id}>
                    <td>
                      <Link to={`/genres/${post._id}`}>{post.name}</Link>
                    </td>
                    <td>
                      <Link
                        className="btn btn-sm btn-info mx-2"
                        to={`/genres/${post._id}`}
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

export default GenresForm;

import React from "react";
//import Joi from "joi-browser";
import Form from "./common/form";
import { getUsers } from "../services/userService";
import { Link } from "react-router-dom";

class UsersForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: ""
    },
    users: [],
    errors: {}
  };

  async populateUsers() {
    const { data: users } = await getUsers();
    this.setState({ users: users });
  }

  async componentDidMount() {
    await this.populateUsers();
    //await this.populateMovie();
  }

  doSubmit = async () => {
    //await saveMovie(this.state.data);
    this.props.history.push("/users");
  };

  render() {
    return (
      <React.Fragment>
        {/* <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button> */}
        {this.renderNewButton("/users/new", "New User")}
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(post => (
              <tr key={post._id}>
                <td>
                  <Link to={`/users/${post._id}`}>{post.email}</Link>
                </td>

                <td>{post.password}</td>
                <td>{post.name}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm m-2"
                    // onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    // onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default UsersForm;

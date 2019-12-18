import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Movies from "./components/movies";
import MovieForm from "./components/movieForm";
import Customers from "./components/customers";
//import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import UsersForm from "./components/usersForm";
import UserForm from "./components/userForm";
import GenresForm from "./components/genresForm";
import GenreForm from "./components/genreForm";
import CustomerForm from "./components/customerForm";
import RentalsForm from "./components/rentalsForm";
import RentalForm from "./components/rentalForm";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/users/:id" component={UserForm} />
            <Route path="/users" component={UsersForm} />

            <Route path="/customers/:id" component={CustomerForm} />
            <Route path="/customers" component={Customers} />

            <Route path="/genres/:id" component={GenreForm} />
            <Route path="/genres" component={GenresForm} />

            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/movies/:id" component={MovieForm} />
            <Route
              path="/movies"
              render={props => <Movies {...props} user={this.state.user} />}
            />
            {/* <Route path="/customers" component={Customers} /> */}
            <Route path="/rentals/:id" component={RentalForm} />
            <Route path="/rentals" component={RentalsForm} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;

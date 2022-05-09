import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Products from "./components/products";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import ProductForm from './components/productForm';
import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';
import Logout from './components/logout';
import ProtectedRoute from "./components/common/protectedRoute";
import authService from "./services/authService";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUser(user);

  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <NavBar user={user} />
      <main className="container">
        <Switch>
          <Route path="/register" component={RegisterForm}></Route>
          <Route path="/login" component={LoginForm}></Route>
          <Route path="/logout" component={Logout}></Route>
          <ProtectedRoute path="/products/:id" component={ProductForm} />
          <ProtectedRoute path="/products" render={props => <Products {...props} user={user} />}></ProtectedRoute>
          <Route path="/not-found" component={NotFound}></Route>
          <Redirect from="/" exact to="/products" />
          <Redirect to="/not-found" />
        </Switch>
      </main>
    </React.Fragment >
  );
}

export default App;

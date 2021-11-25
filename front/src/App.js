import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashboard";
import { ProvideAuth, useAuth } from "./providers/auth";
import Details from "./pages/IoT/details";
import New from "./pages/IoT/new";

function App() {
  useEffect(() => {
    document.title = "NIoT";
  }, []);

  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          New
          <PrivateRoute path="/iot/new" exact children={<New />} />
          <PrivateRoute path="/iot/:id" children={<Details />} />
          <PrivateRoute>
            <Dashboard path="/dashboard" exact />
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default App;

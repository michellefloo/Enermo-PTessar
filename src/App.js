import React, { Fragment } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import PrivateRoute from './components/private-route/PrivateRoute';
import './scss/style.scss';
import "react-datetime/css/react-datetime.css"

const queryClient = new QueryClient();
const App = () => {

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  )
  // Containers
  const TheLayout = React.lazy(() => import('./containers/TheLayout'));
  // Pages
  const Login = React.lazy(() => import('./views/login/Login'));

  return (
      <Fragment>
        <QueryClientProvider client={queryClient}>
          <HashRouter>
              <React.Suspense fallback={loading}>
                <Switch>
                  <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
                  <PrivateRoute path="/" name="Dashboard" component={TheLayout} />
                </Switch>
              </React.Suspense>
          </HashRouter>
        </QueryClientProvider>
    </Fragment>
  );
}


export default App;

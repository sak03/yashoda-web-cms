import React, { useState, Component, Suspense } from 'react'
import {
  HashRouter,
  Route,
  Routes,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom'
import './scss/style.scss'
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import ProtectedRoutes from './auth/ProtectedRoutes';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route
              path="/"
              name="Login Page"
              element={<Login />}
              render={(props) => <Login {...props} />}
            />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path='/' element={<ProtectedRoutes />}>
              <Route exact path="*" name="dashboard" element={<DefaultLayout />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App

import { useState } from "react";
import { Router, Route, Outlet } from "routini";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Default from "./pages/404";
import "./App.css";
import Nav from "./components/Nav";

// This small project shows how to use Routini in a React project.
// It has a few pages and demonstrates the use of dynamic routes, lazy loading, loading state and a default noMatch (404) page.
// Routes can be defined in routes array or as children of the Router component in Route components.

const routes = [
  {
    path: "/contact",
    component: () => <h1>Contact us</h1>,
    loading: <span>Loading contact page...</span>,
  },
  { path: "/product/:productId", component: Product },
  { path: "/search/:query", lazy: () => import("./pages/Search") },
];

const About = () => import("./pages/About");
const Dashboard = () => import("./pages/Dashboard");
const Login = () => import("./pages/Login");
// const Default = () => import("./pages/404");

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Force re-render ({count})
      </button>

      <Router routes={routes} loading={<span>Global Router loading....</span>}>
        <Nav />
        <Route
          path="/:lang/about"
          lazy={About}
          loading={<span>Loading about page...</span>}
        />
        <Route path="/dashboard" lazy={Dashboard} />
        <Route path="/login" lazy={Login} />
        <Route path="*" component={Default} />
        <main className="content">
          <Outlet />
        </main>
        <Route path="/" component={Home} />
        <footer style={{ marginTop: "2rem", textAlign: "center" }}>
          <small>Copyright © 2024</small>
        </footer>
      </Router>
    </>
  );
}
/*
// With layout — Outlet controls where page renders
<Router routes={routes} noMatch={Default}>
  <Nav />
  <Outlet />
  <Footer />
</Router>

// Without layout — content renders automatically
<Router routes={routes} noMatch={Default} />
*/

export default App;

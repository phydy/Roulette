import { Box } from "@chakra-ui/react";

import Navbar from "./components/Navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppRoutes, routes } from "./utils/routes";
import { Suspense } from "react";

export const blackBalls = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

function App() {
  return (
    <Suspense fallback={null}>
      <Router>
        <Navbar />

        <Routes>
          {routes.map((route: AppRoutes, index: number) => {
            const { component: Component, path, exact } = route;
            return <Route key={index} path={path} element={<Component />} />;
          })}
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;

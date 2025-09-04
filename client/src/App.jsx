import React from "react";
import AllRoutes from "./allRoutes/AllRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AllRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;

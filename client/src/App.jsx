import React from "react";
import AllRoutes from "./allRoutes/AllRoutes";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <AllRoutes />
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;

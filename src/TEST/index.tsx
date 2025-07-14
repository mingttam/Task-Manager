import Error404 from "./Error404";
import UserForm from "./Test1/UserForm";
import UserList from "./Test2/UserList";
import Navigation from "./Test3/Navigation";
import UserDetails from "./Test3/UserDetails";
import { UserProvider } from "./UserProvider";
import { BrowserRouter, Routes, Route } from "react-router";

const Test = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <div className="py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                      <h1 className="text-3xl font-bold text-center mb-8">
                        User Management System
                      </h1>
                      <UserForm />
                    </div>
                    <UserList />
                  </div>
                }
              />
              <Route
                path="/users"
                element={
                  <div className="max-w-4xl mx-auto">
                    <UserList />
                  </div>
                }
              />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};

export default Test;

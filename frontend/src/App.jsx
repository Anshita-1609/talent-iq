import { useUser } from "./lib/mockAuth.jsx";
import { Navigate, Route, Routes, useParams } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import JoinSessionPage from "./pages/JoinSessionPage";

function RequireAuthSession() {
  const { id } = useParams();
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to={`/join/${id}`} replace />;
  return <SessionPage />;
}

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/join/:id" element={<JoinSessionPage />} />
        <Route path="/session/:id" element={<RequireAuthSession />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;

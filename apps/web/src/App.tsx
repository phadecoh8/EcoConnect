import { Link, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <main>
      <h1>EcoConnect Ekiti</h1>
      <p>Report a community problem in Ikole and Oye.</p>
      <nav>
        <Link to="/">Home</Link> � <Link to="/report">Report a problem</Link> �{" "}
        <Link to="/track">Track a report</Link>
      </nav>
      <Routes>
        <Route path="*" element={<p>Welcome to EcoConnect Ekiti.</p>} />
      </Routes>
    </main>
  );
}

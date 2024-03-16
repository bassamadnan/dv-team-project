import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Geomap from "./graphs/geomap";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Geomap></Geomap>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

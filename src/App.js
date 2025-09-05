import CreateFeedBack from "./features/createFeedBack";
import CreateProperty from "./features/createProperty";
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListPropertyPage from "./features/listProperty";
import { Provider } from 'react-redux';
import { store } from './store/store';
import PropertyDetails from "./component/PropertyDetails";
import { Navbar } from "reactstrap";

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Navbar>
            <Routes>
              <Route path="/" element={<ListPropertyPage />} />
              <Route path="/create-property" element={<CreateProperty />} />
              <Route path="/feedback/:id" element={<CreateFeedBack />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
            </Routes>
          </Navbar>
        </Router>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;

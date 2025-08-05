import CreateFeedBack from "./features/createFeedBack";
import CreateProperty from "./features/createProperty";
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListPropertyPage from "./features/listProperty";
import { Provider } from 'react-redux';
import { store } from './store/store';
import PropertyDetails from "./component/PropertyDetails";

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<ListPropertyPage />} />
              <Route path="/create-property" element={<CreateProperty />} />
              <Route path="/create-feedback" element={<CreateFeedBack />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
            </Routes>
          </div>
        </Router>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;

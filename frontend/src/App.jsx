import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Reading } from './pages/reading'
import { Summary } from './pages/summary'
import { FiltersProvider } from './context/FiltersContext'

const App = () => (
    <BrowserRouter>
        <FiltersProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Reading />} />
                    <Route path="/summary" element={<Summary />} />
                </Route>
            </Routes>
        </FiltersProvider>
    </BrowserRouter>
);

export default App;

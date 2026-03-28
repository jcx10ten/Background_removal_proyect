import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MockupEditor from './pages/MockupEditor'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mockup" element={<MockupEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
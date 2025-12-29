import Navbar from './components/Navbar'
import Home from './pages/Home/Home'

import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import Anniversary from './pages/Anniversary/Anniversary'
import Memories from './pages/Memories/Memories'
import Letter from './pages/Letter/Letter'
import Future from './pages/Future/Future'
import NotFound from './pages/NotFound/NotFound'

const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/anniversary' element={<Anniversary/>} />
        <Route path='/memories' element={<Memories/>} />
        <Route path='/letter' element={<Letter/>} />
        <Route path='/future' element={<Future/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      {/* <Footer/> */}
      
     
    </>
  )
}

export default App

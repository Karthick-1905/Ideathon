import {createBrowserRouter,RouterProvider,createRoutesFromElements, Route, Navigate} from 'react-router-dom'

import MainLayout from './layouts/Mainlayout'
import MapLayout from './layouts/MapLayout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import {useQuery} from 'react-query'
import axios from 'axios'
import LandingPage from './components/Landing/LandingPage'

function App() {
  const {data:authUser,isLoading} = useQuery({
    queryKey:['authUser'],
    queryFn:async() =>{
      const {data} = await axios.get('/api/v1/auth/auth-user');
      console.log(data);
      return data.user
    },
    retry:false,
  })

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout authUser={authUser}/>}>
        <Route index element={<LandingPage/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='register' element={<Register/>}></Route>
        <Route path='maps' element={<MapLayout/>}/>
      </Route>
    )
  )
  return (
    <RouterProvider router={router}/>
  )
}

export default App

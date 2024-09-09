import {Outlet} from 'react-router-dom'
import SideBar from '../components/SideBar'


const MainLayout = ({authUser}) =>{
   return(
      <div className='flex h-screen w-screen'>
         <Outlet context={authUser}/>
      </div>
   )
}


export default MainLayout
import {Outlet} from 'react-router-dom'
import SideBar from '../components/SideBar'


const MainLayout = ({authUser}) =>{
   return(
      <div className='flex h-screen w-screen'>
         {
            authUser && 
         <div className='w-14'>
            <SideBar/>
         </div>
         }
         <div className='w-full flex '>
            <Outlet context={authUser}/>
         </div>
      </div>
   )
}


export default MainLayout
import { Link } from 'react-router-dom'
import {SideBarButtons} from '../utils/SideBar'


const SideBar = () => {
  return (
    <div>
        <ul className='menu bg-base-200'>
            {
                SideBarButtons.map((btn)=>{
                    return <li key={btn.name}>
                        <Link to={btn.link}><button className='tooltip tooltip-right' data-tip={btn.name}>{btn.element}</button></Link>
                    </li>
                })
            }
        </ul>
    </div>
  )
}

export default SideBar
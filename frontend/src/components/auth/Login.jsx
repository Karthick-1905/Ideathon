import {useEffect,useState} from 'react';
import { loginFields } from '../../utils/formFields';
import FormInput from '../FormInput';
import {Link} from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query';

import axios from 'axios'
import toast from 'react-hot-toast';


const Login = () => {

    const fieldState = {};
    useEffect(()=>{
        loginFields.forEach(field => fieldState[field.name] = '') 
      },[])
    const [loginState,setLoginState] = useState(fieldState);
    const handleChange = (e) =>{
        setLoginState({...loginState,[e.target.name]:e.target.value})
      }
    const queryClient = useQueryClient()

    const {mutate:loginAction,isLoading} = useMutation({
        mutationFn:async() =>{
            console.log("Logging in")
            const {data} = await axios.post('/api/v1/auth/login',loginState)

            return data.msg
        },
        onSuccess:()=>{
            toast.success("User Registered Successfully")
            queryClient.invalidateQueries("authUser")
        },
        onError:(err) =>{
            toast.error("Login Failed")
        }
    })

    const handleSubmit = (e) =>{
        e.preventDefault();
        loginAction();
    }

    return (
        <div className="flex w-full justify-center items-center min-h-screen bg-gray-100">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-center">Login</h2>
                    <form method='POST' onSubmit={handleSubmit}>
                        {loginFields.map((field) => (
                            <FormInput key={field.id} {...field} onChange={handleChange} value={loginState[field.name]} />
                        ))}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary w-full">Login</button>
                        </div>
                    </form>
                    <p className="text-center text-sm mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
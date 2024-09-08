import React, { useEffect,useState } from 'react';
import { registerFields } from '../../utils/formFields';
import FormInput from '../FormInput'
import {useMutation,useQueryClient} from 'react-query'
import axios from 'axios'
import {toast} from 'react-hot-toast'


const Register = () => {
  //setting register field states
  const fieldState = {};
  useEffect(()=>{
    registerFields.forEach(field => fieldState[field.name] = '') 
  },[])
    const [registerState,setRegisterState] = React.useState(fieldState);
    const [passwordError, setPasswordError] = useState(false);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setRegisterState({ ...registerState, [name]: value });
      if (name === 'password' || name === 'confirm-password') {
        validatePassword(registerState.password, registerState['confirm-password']);
      }
    };

    const validatePassword = (password, confirmPassword) => {
      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          setPasswordError(true); // Passwords don't match
        } else {
          setPasswordError(false); // Passwords match
        }
      }
    };

    //setting The query
    const queryClient = useQueryClient();
    const {mutate:registerAction,isLoading}  = useMutation({
      mutationFn:async()=>{
        const { data } = await axios.post('/api/v1/auth/register', {
          username: registerState.username,
          email: registerState.email,
          password: registerState.password,
          phoneNo: registerState.phoneNo,
          secondaryPhoneNo: registerState.secondaryPhoneNo
        });
        console.log(data);
        return data.msg;
      },
      onSuccess:()=>{
          toast.success("User Registered sucessfully")
          queryClient.invalidateQueries('authUser');
      },
      onError:() =>{
        toast.error("User Registeration Failed.")
      }
    })

    const handleSubmit = (e) => {
      e.preventDefault();
      registerAction()
    };

    return (
      <div className="flex w-full justify-center items-center min-h-screen bg-gray-100">
          <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
              <div className="card-body">
                  <h2 className="card-title text-center text-2xl font-bold mb-6">Register</h2>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                      {registerFields.map((field) => (
                          <FormInput
                          key={field.id}
                          {...field}
                          value={registerState[field.name]}
                          onChange={handleChange}
                          className={field.name === 'confirm-password' && passwordError ? 'input-error' : ''}
                        />
          
                      ))}
                      <div className="col-span-1 md:col-span-2">
                          <button type="submit" className="btn btn-primary w-full">Register</button>
                      </div>
                  </form>
                  <p className="text-center text-sm mt-4">
                      Already have an account?{' '} 
                      <a href="/login" className="text-primary font-semibold hover:underline">
                          Login here
                      </a>
                  </p>
              </div>
          </div>
      </div>
  );
};

export default Register;
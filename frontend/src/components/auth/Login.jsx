import React from 'react';
import { loginFields } from '../../utils/formFields';
import FormInput from '../FormInput';
import {Link} from 'react-router-dom'

const Login = () => {
    return (
        <div className="flex w-full justify-center items-center min-h-screen bg-gray-100">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-center">Login</h2>
                    <form>
                        {loginFields.map((field) => (
                            <FormInput key={field.id} {...field} />
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
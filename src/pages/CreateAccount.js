import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Input, Label, Button } from '@windmill/react-ui'
import toast from 'react-hot-toast'
import { useUserRegisterMutation } from '../features/auth/auth'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { useForm } from 'react-hook-form'

function Login() {

   const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
      } = useForm()
  
      const [userRegister] = useUserRegisterMutation()
      const history = useHistory();
  
      const [image, setImage] = useState(null);
  
  
    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };
  
  
      const onFormSubmit = async (data) => {
        console.log("formData", data)
      const formData = new FormData();
      formData.append("FirstName", data.FirstName);
      formData.append("LastName", data.LastName);
      formData.append("Email", data.Email);
      formData.append("Password", data.Password);
      formData.append("Phone", data.Phone); 
      formData.append("Role", data.Role); 
      if (image) {
        formData.append("image", image);
      }
  
      console.log("formData", formData)
  
  
      try {
        const res = await userRegister(formData);
        if (res.data?.success) {
          toast.success(res.data.message);
          history.push('/login');
        } else {
          toast.error(res.error?.data?.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    };
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                         <div className="grid grid-cols-1 gap-4">
                           {/* Left Side */}
                     
                             <div className="mb-4">
                               <label className="block text-sm mb-1 text-gray-700">First Name</label>
                               <Input
                                 type="text"
                                 {...register("FirstName")}
                                 className="input input-bordered w-full form-control shadow-md p-3"
                               />
                               {errors.FirstName && (
                                 <p className="text-red-500 text-sm mt-1">{errors.FirstName.message}</p>
                               )}
                             </div>
                             <div className="mb-4">
                               <label className="block text-sm mb-1 text-gray-700">Last Name</label>
                               <Input
                                 type="text"
                                 {...register("LastName")}
                                 className="input input-bordered w-full form-control shadow-md p-3"
                               />
                               {errors.LastName && (
                                 <p className="text-red-500 text-sm mt-1">{errors.LastName.message}</p>
                               )}
                             </div>
                             <div className="mb-4">
                               <label className="block text-sm mb-1 text-gray-700">Mobile Number</label>
                               <Input
                                 type="number"
                                 {...register("Phone")}
                                 className="input input-bordered w-full form-control shadow-md p-3"
                               />
                               {errors.Phone && (
                                 <p className="text-red-500 text-sm mt-1">{errors.Phone.message}</p>
                               )}
                             </div>
                             <div className="mb-4">
                               <label className="block text-sm mb-1 text-gray-700">Email</label>
                               <Input
                                 type="email"
                                 {...register("Email")}
                                 className="input input-bordered w-full form-control shadow-md p-3"
                               />
                               {errors.Email && (
                                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                               )}
                             </div>
                             <div className="mb-4">
                               <label className="block text-sm mb-1 text-gray-700">Password</label>
                               <Input
                                 type="password"
                                 {...register("Password")}
                                 className="input input-bordered w-full form-control shadow-md p-3"
                               />
                               {errors.Password && (
                                 <p className="text-red-500 text-sm mt-1">{errors.Password.message}</p>
                               )}
                             </div>
                         
                             <div className="form-group">
                                    <label className="font-weight-700">Profile Image</label>
                                    <input type="file" accept="image/*" className="form-control" style={{paddingTop:"12px"}}  onChange={handleImageChange} />
                                     {/* <input type="file" accept="application/pdf" onChange={handleImageChange} /> */}
                                   </div>
                      
                         </div>
                       
                         <Label className="mt-6" check>
                <Input type="checkbox" />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label>

              <Button type="submit" block className="mt-4" style={{backgroundColor:"#C71320"}}>
                Create account
              </Button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p>
                       </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login

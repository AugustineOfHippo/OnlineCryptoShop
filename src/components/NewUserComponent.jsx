import React from 'react'
import { useState } from 'react';

export default function NewUserComponent({smtContract,signer,walletAddress,setLoggedUser}) {

    const [newUser,setNewUser] = useState({
        email:'',
        fullname:'',
        phonenumber:''
    });

    const handleChange = (e) => {
        setNewUser(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const register = async() => {
        try {
            const signed = await smtContract.connect(signer);
        const resp = await signed.createUser(newUser.email,newUser.fullname,newUser.phonenumber);
            setLoggedUser({ email:newUser.email, fullName:newUser.fullname, phoneNumber:newUser.phonenumber});
        } catch (error) {
            console.log("Error: "+error);
        }
    }



  return (
    <div className=' w-1/5 mx-auto p-2 flex flex-col'>
           <label className='text-slate-500'>Email</label>
           <input
           onChange={handleChange}
           name="email"
            className='p-2 rounded-md bg-slate-200' />
           <label className='text-slate-500'>Full Name</label>
           <input
           onChange={handleChange}
           name="fullname"
            className='p-2 rounded-md bg-slate-200' />
           <label className='text-slate-500'>Phone Number</label>
           <input
           onChange={handleChange}
            name="phonenumber"
            className='p-2 rounded-md bg-slate-200' />
           <button
           onClick={register}
            className='bg-slate-500 hover:bg-slate-600 p-2 rounded-md mt-2 text-white '>Register</button>
    </div>
  )
}

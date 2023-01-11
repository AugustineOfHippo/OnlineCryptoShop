import React from 'react'
import { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { addParts,setParts } from '../slices/parts';
import { BigNumber } from 'ethers';


export default function NewPartComponent({signer,smtContract,owner,walletAddress}) {

    const [newPart,setNewPart] = useState({
        name:'',
        quantity:0,
        price:0
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setNewPart(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const addPart = async () => {
        const myprice = BigNumber.from((newPart.price * (10**18)).toString());

       
        try {
          const signed = await smtContract.connect(signer);
          const resp = await signed.addPart(newPart.name, newPart.quantity, myprice)
          .then(() => {
          dispatch(addParts( { name:newPart.name, quantity:newPart.quantity, price:newPart.price } ));
          })
        } catch (error) {
          console.log("Error: "+error);
        }

      }

      useEffect(() => {
        console.log(walletAddress)
        console.log(owner)
      },[])
      if(owner !== walletAddress) return '';

  return (
    <div className='mt-2 flex flex-col p-2 mx-auto w-1/5 '>
        <label className='text-black'>Part Name</label>
        <input
        name="name"
        onChange={handleChange} 
        className=' rounded-md p-2 bg-slate-300'/>
        <label className='text-black'>Quantity</label>
        <input
        type="number"
        name="quantity"
        onChange={handleChange} 
         className=' rounded-md p-2 bg-slate-300'/>
        <label className='text-black'>Price</label>
        <input
        onChange={handleChange}
        name="price"
         className=' rounded-md p-2 bg-slate-300' type="number" />
        <button
        onClick={addPart}
         className='bg-black text-white rounded-md p-2 mt-2'>Add Part</button>
    </div>
  )
}

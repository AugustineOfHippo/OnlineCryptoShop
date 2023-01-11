import React from 'react'
import { useEffect,useState } from 'react'
import { BigNumber,ethers } from 'ethers';
import { useSelector,useDispatch } from 'react-redux';
import { setParts,addParts } from '../slices/parts';

export default function PartsComponent({smtContract,tknContract, signer}) {

    // const [parts,setParts] = useState([])
    const parts = useSelector(state => state.parts.parts);
    const dispatch = useDispatch();
    
    const getParts = async() => {
        try {
            const resp = await smtContract.partId();
            const partid = parseInt(resp._hex,16);




            for( let i = 0; i < partid; i++){
                const resp2 = await smtContract.partsMap(i);    
                const _price = parseInt(resp2.price._hex,16).toString();
                const slicedPrice = _price.slice(0,_price.length -18);
                const _quantity = parseInt(resp2.quantity._hex,16)
                const _id = parseInt(resp2.id._hex,16);

                dispatch(addParts({id:_id, name:resp2.name, quantity:_quantity, price:slicedPrice }));
            }
            console.log(parts);
            
        } catch (error) {
            console.log("Error: "+error)
        }
    };

    const approve = async(price,amount) => {
        let realPrice = (price * (10**18) * (amount)).toString() ;
        try {
            const signed = await tknContract.connect(signer);
            const resp = await signed.approve(smtContract.address,BigNumber.from(realPrice));
            console.log(resp);        
        } catch (error) {
            console.log('Error: '+error)
        }
    }

    const buyPart = async(id,amount) => {
        try {
            console.log(id);
            const signed = await smtContract.connect(signer);
            const resp = await signed.buyPart(id,amount);
            console.log(resp);
        } catch (error) {
            console.log("Error: "+error);
        }
    }

    
  return (
    <div className=' flex flex-col p-2 rounded-md mx-auto items-center'>
        <button
        onClick={getParts}
         className='bg-blue-400 hover:bg-blue-500 text-white rounded-md mb-2 p-2 w-1/3'>View Parts</button>
            {/* <button
            onClick={checkTrans}
             className='bg-orange-400'>Transac</button> */}
             <div className='flex bg-slate-200 text-slate-800 text-xs capitalize w-1/3 p-2 rounded-md '>
                <h1 className='w-1/3'>Name</h1>
                <h1 className='w-1/4'>Qty</h1>
                <h1 className='w-1/4'>Price</h1>
             </div>
         {parts.map(part => (
            <>
            <div className='flex  bg-slate-200 p-2 rounded-md mt-2 w-1/3 text-sm items-center relative'>
                <h1 className='w-1/3'>{part.name}</h1>
                <h1 className='w-1/4'>{part.quantity}</h1>
                <h1 className='w-1/4'>{part.price}</h1>
                <button
                onClick={() => approve(part.price,1)}
                 className='bg-blue-400 rounded-md p-1 text-white absolute right-12'>Approve</button>

                <button
                onClick={() => buyPart(part.id,1)}
                 className='bg-green-400 rounded-md p-1 text-white absolute right-1'>Buy</button>
            </div>
            </>
         ))}
        </div>
  )
}

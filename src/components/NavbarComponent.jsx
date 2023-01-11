import React from 'react'
import { useState,useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { ethers, BigNumber } from "ethers";
import NordSudContract from '../eth/NordSudContract';
import NordSudTokenContract from '../eth/NordSudToken';


export default function NavbarComponent({connectWallet,walletAddress,loggedUser,getUserInfo}) {


  return (
    <div className='bg-slate-200 p-2 flex justify-between items-center'>


        {loggedUser ? <h1 className='capitalize text-xs'>Welcome {loggedUser.fullName}</h1> : 'Please Log In Or Register' }
        {
        walletAddress ? 
        <h1 className='text-xs p-2 rounded-md'>{walletAddress}</h1> 
        :
        <button
        onClick={() => connectWallet()}
         className='bg-slate-400 hover:bg-slate-500 p-1 px-4 text-white rounded-md'>Connect</button>
         }


    </div>
  )
}

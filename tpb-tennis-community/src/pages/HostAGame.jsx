import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { supabase } from "../services/createClient.js";
import { CiLocationOn } from "react-icons/ci";
import { BsCalendarDate } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { FaRegStar } from "react-icons/fa6";
import { MdEditNote } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { UserAuth } from '../context/AuthContext.jsx';

export default function HostAGame() {
    const {session} = UserAuth();
    const userId = session?.user?.id;

    const [formData, setFormData] =useState({
        court_name: "",
        game_date: "",
        game_start_time: "",
        game_end_time:"",
        total_vacancies: 1,
        required_skill_level: 1,
        notes: ""
    })

    const navigate = useNavigate()

    function handleChange(e){
        const {name, value} = e.target
        setFormData((prev)=>({...prev,[name]:value}))
    }

    function handlecancel(){
        //resetting the form
        setFormData({
            court_name: "",
            game_date: "",
            game_start_time: "",
            game_end_time: "",
            total_vacancies: "",
            required_skill_level: "",
            notes: ""
        });

    }

    async function handleSubmit(e){
        e.preventDefault()
 
        const reference_number = Math.floor(100000 + Math.random() * 900000);
        

        try{

        const {data, error} = await supabase.from('games').insert([
            {
            court_name: formData.court_name,
            game_date: formData.game_date,
            game_start_time: formData.game_start_time,
            game_end_time:formData.game_end_time,
            total_vacancies: formData.total_vacancies,
            available_vacancies:formData.total_vacancies,
            required_skill_level: formData.required_skill_level,
            notes: formData.notes,
            reference_number:reference_number,
            status: 'Open',
            host_user_id:userId
            
           }
        ])

        if(error){
            console.error('Error inserting game:', error);
            toast.error("Error inserting game")
        }else{
            console.log('Game created successfully:', data);
            toast.success("Game created successfully")
            navigate("/games")
        }

    }catch(error){
        console.error("Unexpected error occurs", error)
    }
    }
    
  return (
    <>
    <Navbar />
    <div className="flex flex-col mt-20">
          

    <div className='bg-[#F8F9FA] w-full h-full min-h-screen flex justify-center items-center'>
        <div className="flex flex-col space-y-6">
    <h1 className="text-2xl font-bold ml-2">Host a Tennis Game</h1>

    <div className='bg-[#FFFFFF] w-full max-w-[750px] min-h-[630px] flex flex-col items-center shadow-lg rounded-lg gap-2 p-6'>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-8 w-full'>
     <div className="flex flex-col">
            <label htmlFor="court_name" className="text-md mt-8 font-semibold">Tennis Court Name</label>
            <div className="relative w-full mt-1">
                <CiLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                <input
                type="text"
                name="court_name"
                value={formData.court_name}
                onChange={handleChange}
                className="pl-10 w-full border rounded-lg p-2"
                placeholder="Enter court name"
                required
                />
            </div>
            </div>

    <div className='flex flex-col md:flex-row gap-4 w-full'>
        <div className='flex flex-col w-full md:w-1/3'>
            <label htmlFor="" className="text-md font-semibold">Date</label>
            <div className='relative w-full mt-1'>
            <BsCalendarDate className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
            <input type="date" name="game_date" value={formData.game_date}
            className="pl-10 border rounded-lg p-2 w-[220px]" onChange={handleChange}  required/>
            </div>
        </div>

      <div className='flex flex-col w-full md:w-1/3 '>
        <label htmlFor="startTime" className="text-md font-semibold">Start Time</label>
         <div className='relative w-full mt-1'>
            <MdAccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none"/>
        <input type="time" id="startTime" name="game_start_time" value={formData.game_start_time} className="pl-10 border rounded-lg p-2 w-[220px]" onChange={handleChange} required/>
        </div>
        </div>

        <div className='flex flex-col w-full md:w-1/3 '>
        <label htmlfor="endTime" className="text-md font-semibold">End Time</label>
        <div className='relative w-full mt-1'>
            <MdAccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none"/>
            <input type="time" id="endTime" name="game_end_time" value={formData.game_end_time} className="pl-10 border rounded-lg p-2 w-[220px]" onChange={handleChange} required/>
        </div>
    </div>
    </div>


    <div className='flex flex-col md:flex-row gap-3 w-full'>
        <div className='flex flex-col w-full md:w-1/2'>
            <label htmlfor="" className='text-md font-semibold'>Number of Vacancies</label>
            <div className='relative w-full mt-1'>
                <GoPeople  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none"/>
                <select name="total_vacancies" id="" value={formData.total_vacancies} onChange={handleChange} className='pl-10 border rounded-lg p-2 w-[350px]'>
                        <option value="1">1 </option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        </select>
            </div>        
        </div>

        <div className='flex flex-col w-full md:w-1/2'>
            <label htmlFor="" className='text-md font-semibold'>Required Skill Level</label>
            <div className='relative w-full mt-1'>
                <FaRegStar  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none"/>
                <select name="required_skill_level" id="" value={formData.required_skill_level} onChange={handleChange} className='pl-10 border rounded-lg p-2 w-[350px]'>
                        <option value="1">1 - Beginner</option>
                        <option value="2">2 - Basic</option>
                        <option value="3">3 - Intermediate</option>
                        <option value="4">4 - Advanced</option>
                        <option value="5">5 - Expert</option>
                </select>
            </div>
        </div>
    </div>

    <div>
        <div className='flex flex-col'>
            <label htmlFor="" className='text-md font-semibold'>Additional Notes (Optional)</label>
            <div className='relative w-full mt-1'>
                <MdEditNote  className="absolute left-3 top-[10px] text-gray-500 w-5 h-5 pointer-events-none"/>
                <textarea name="notes" id="" value={formData.notes} onChange={handleChange} placeholder='any special requirements or information' className='pl-10 border rounded-lg p-2 w-full h-[100px]'></textarea>
            </div>
        </div>
  </div>

  <div className='flex flex-col md:flex-row justify-end gap-4 w-full'>
    <button type="button" className='w-full md:w-[100px] h-[40px] border border-gray-400 text-gray-600 rounded-lg text-md font-semibold cursor-pointer'  onClick={handlecancel}>Cancel</button>
    <button type="submit" className= 'w-full md:w-[150px] h-[40px] bg-green-500 text-white rounded-lg font-semibold cursor-pointer hover:bg-green-600 transition-colors duration-200'>Host Game</button>
  </div>

      </form>
      </div>
      <div className='bg-[#FEFCE8] w-full max-w-[750px] border border-[#FEF08A] p-4 shadow-md rounded-lg mx-auto mb-6'>
            <div className='flex items-center gap-2 mb-2'>
                <IoIosInformationCircleOutline className='text-yellow-500 w-5 h-5' />
                <p className='text-xl text-[#946329] font-bold'>Information</p>
            </div>

            <p className='text-lg text-[#946329]'>
                After submitting this form, a unique reference number will be generated for your game. <br />
                If someone requests to join your game you will be notified about your game via SMS.
            </p>
        </div>

    </div>
    </div>
    </div>
    </>
  )
}

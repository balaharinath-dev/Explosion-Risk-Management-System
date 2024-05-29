import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router,Route,Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import Sensor from './components/home';
import Employee from './components/employee';
import Management from './components/management';
import Evacuate  from './components/evacuate';

function App() {

    const [isLogged,setLogged]=useState(false);
    
    const [isLoading,setLoading]=useState(true);

    const [loginType,setLoginType]=useState({
      status:"",
      username:"",
      role:"",
    });

    const handleLogin=(industryid:string,role:string)=>{
      setLogged(true)
      setLoginType({
        status:role?.split("-")[0],
        username:industryid,
        role:role
      })
    }

    useEffect(()=>{
      const checkLogin=async()=>{
        const checkSession=await fetch("http://localhost:5000/session",{
          headers:{"Content-type":"application/json"},
          method:"POST",
          credentials:"include"
        })
        const sessionResponse=await checkSession.json()
        if(sessionResponse.message==="Session found"){
          setLogged(true)
          setLoginType({
            status:sessionResponse.data.role?.split("-")[0],
            username:sessionResponse.data.username,
            role:sessionResponse.data.role,
          })
        }
        else{
          const checkCookie=await fetch("http://localhost:5000/cookie",{
            headers:{"Content-type":"application/json"},
            method:"POST",
            credentials:"include"
          })
          const cookieResponse=await checkCookie.json()
          if(cookieResponse.message==="Cookie found"){
            setLogged(true)
            setLoginType({
              status:cookieResponse.data.role?.split("-")[0],
              username:cookieResponse.data.username,
              role:cookieResponse.data.role,
            })
          }
          else{
            setLogged(false)
          }
        }
        setLoading(false)
      }
      checkLogin()
    },[])

    if(isLoading){
      return (
        <h1>Loading...</h1>
      )
    }

    if((!loginType.role)||(!loginType.status)||(!loginType.username)){
      const logout=async()=>{
        await fetch("http://localhost:5000/logout",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials:"include",
        })
      }
      logout()
    }

  return (
    <Router>
      <Routes>
        <Route path='/login' element={isLogged?(loginType.status==="Admin"?<Navigate to='/sensorStatus'/>:<Navigate to='/evacuate'/>):<Login onLogin={handleLogin}></Login>}/>
        <Route path='/sensorStatus' element={isLogged&&loginType.status==="Admin"?<Sensor/>:<Navigate to='/login'/>}/>
        <Route path='/employeeStatus' element={isLogged&&loginType.status==="Admin"?<Employee/>:<Navigate to='/login'/>}/>
        <Route path='/employeeManagement' element={isLogged&&loginType.status==="Admin"?<Management/>:<Navigate to='/login'/>}/>
        <Route path='/evacuate' element={isLogged&&loginType.status==="Employee"?<Evacuate username={loginType.username}/>:<Navigate to='/login'/>}/>
        <Route path='/' element={isLogged?(loginType.status==="Admin"?<Navigate to='/sensorStatus'/>:<Navigate to='/evacuate'/>):<Navigate to='/login'/>}/>
        <Route path='*' element={<h1>Error 404 - Page not found...</h1>}/>
      </Routes>
    </Router>
  );
}

export default App;
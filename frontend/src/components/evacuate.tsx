import { Dot } from "react-bootstrap-icons"
import style from "../utilities/evacuate.module.css"
import { Container,Row,Col, Button } from "react-bootstrap"
import { useEffect, useState } from "react"

interface userProp{
    username:string;
}

const Evacuate:React.FC<userProp>=({username})=>{

    // const today:Date=new Date();
    // const year:number=today.getFullYear();
    // const month:number=today.getMonth() + 1;
    // const day:number=today.getDate();
    // const formattedMonth:string=month<10?`0${month}`:`${month}`;
    // const formattedDay:string=day<10?`0${day}`:`${day}`;
    // const formattedDate:string=`${year}-${formattedMonth}-${formattedDay}`;

    const [evacuateStatus,setEvacuateStatus]=useState(false)

    const [isLoading,setLoading]=useState(true)

    useEffect(()=>{
        const fetchEvacuation=async()=>{
            const evacuateReq=await fetch("http://localhost:5000/fetchEvacuator",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",
                body:JSON.stringify({id:username,date:"2024-01-01"})
            })
            const evacuateRes=await evacuateReq.json()
            setEvacuateStatus(evacuateRes.status.evacuated)
            setLoading(false)
        }
        fetchEvacuation()
    },[username])

    const handleEvacuation=()=>{
        const evacuate=async()=>{
            const evacuateReq=await fetch("http://localhost:5000/evacuator",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",
                body:JSON.stringify({id:username,value:(!evacuateStatus),date:"2024-01-01"})
            })
            const evacuateRes=await evacuateReq.json()
            setEvacuateStatus(!evacuateRes.status)
        }
        evacuate()
    }

    const handleLogout=()=>{
        const logout=async()=>{
            const logoutReq=await fetch("http://localhost:5000/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",
            })
            const logoutRes=await logoutReq.json()
            if(logoutRes.message==="Logged out successfully"){
                window.location.reload()
            }
        }
        logout()
    }

    if(isLoading){
        return null
    }

    return (
        <div className={`${style.mainContainer} p-4`}>
            <div className={`d-flex flex-column align-items-center justify-content-center w-100`}>
                <h1 className={`m-0 d-lg-block d-none`}>Explosion Risk Management System<Dot></Dot>Employee Evacuation</h1>
                <h5 className={`m-0 d-block d-md-none mb-2`}>Explosion Risk Management System</h5>
                <h5 className={`m-0 d-block d-md-none`}>Employee Evacuation</h5>
            </div>
            <Container className={`m-0 p-0 d-flex justify-content-center align-items-center h-100 mt-2`}>
                <Row className={`m-0 p-0 w-100`}>
                    <Col className="d-flex justify-content-center align-items-center mb-2" xl={12}><b>Employee ID: {`${username}`}</b></Col>
                    <Col className="d-flex justify-content-center align-items-center mb-2" xl={12}><b>Date: {`2024-01-01`}</b></Col>
                    <Col className="d-flex justify-content-center align-items-center mb-2 p-3" xl={12}>
                        <Button id="btnEvacuate" onClick={handleEvacuation} className={evacuateStatus?style.evacuated:style.evacuate}>{evacuateStatus?"Evacuated":"Evacuate"}</Button>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center" xl={12}><Button type="button" variant="dark" className="bg-dark" onClick={handleLogout}>Logout</Button></Col>
                </Row>
            </Container>
        </div>
    )
}

export default Evacuate
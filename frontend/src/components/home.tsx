import React, { useEffect, useState } from "react"
import style from "../utilities/home.module.css"
import oilDataModel from "../models/oilDataModel"
import gasDataModel from "../models/gasDataModel"
// import alertSiren from "../utilities/audios/alertSiren.mp3"
import { Button, Col, Container, Offcanvas, Row, ListGroup} from "react-bootstrap"
import { DeviceSsd, Dot, List, People, Book } from "react-bootstrap-icons"
import io from "socket.io-client"

const socket=io("http://localhost:4000")
var delay=setTimeout(()=>{console.log("")},1)

const Sensor=()=>{

    const[isLoading,setLoading]=useState(true)

    // const audio=new Audio(alertSiren)

    // const playAudioLoop=()=>{
    //     audio.loop=true
    //     audio.play()
    // }

    // const stopAudio=()=>{
    //     audio.pause()
    //     audio.currentTime=0
    // }

    const [oilData,setOilData]=useState<oilDataModel>({
        oilValue:0,
        oilStatus:"Loading...",
        sectorNo:0,
        timeStamp:"Loading..."
    })

    const [gasData,setGasData]=useState<gasDataModel>({
        gasValue:0,
        gasStatus:"Loading...",
        sectorNo:0,
        timeStamp:"Loading..."
    })

    // if(oilData.oilStatus==="BAD"||gasData.gasStatus==="BAD"){
    //     playAudioLoop()
    // }
    // else{
    //     stopAudio()
    // }

    const [show, setShow] = useState(false)

    const handleClose=()=>setShow(false)
    const handleShow=()=>setShow(true)

    useEffect(()=>{
        const fetchData=async()=>{
            const oilData=await fetch("http://localhost:5000/oil",{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                credentials:"include",
            })
            const oilDataResponse=await oilData.json()
            const oilStringTimer=oilDataResponse.data.timeStamp
            const oilActualTime=oilStringTimer.slice(11, 19) + " " +oilStringTimer.slice(8, 10) + "/" +oilStringTimer.slice(5, 7) + "/" +oilStringTimer.slice(0, 4)
            oilDataResponse.data.timeStamp=oilActualTime
            setOilData(oilDataResponse.data)
            const gasData=await fetch("http://localhost:5000/gas",{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                credentials:"include",
            })
            const gasDataResponse=await gasData.json()
            const gasStringTimer=gasDataResponse.data.timeStamp
            const gasActualTime=gasStringTimer.slice(11, 19) + " " +gasStringTimer.slice(8, 10) + "/" +gasStringTimer.slice(5, 7) + "/" +gasStringTimer.slice(0, 4)
            gasDataResponse.data.timeStamp=gasActualTime
            setGasData(gasDataResponse.data)
            setLoading(false)
            if(oilDataResponse.data.oilStatus==="BAD"||gasDataResponse.data.gasStatus==="BAD"){
                handleDelay()
            }
        }
        fetchData()
        setInterval(fetchData,10000)
    },[])

    useEffect(()=>{
        socket.on('alert',(data:string)=>{
            const {IT,SN}=JSON.parse(data)
            if(SN===1){
                setOilData((prev)=>({
                    ...prev,oilStatus:"BAD"
                }))
            }
            else{
                setGasData((prev)=>({
                    ...prev,gasStatus:"BAD"
                }))
            }
            console.log(IT)
            handleDelay()
        })
    },[])

    const handleAlert=()=>{
        if(oilData.oilStatus==="BAD"){
            setOilData((prev)=>({
                ...prev,oilStatus:"GOOD"
            }))
        }
        else{
            setGasData((prev)=>({
                ...prev,gasStatus:"GOOD"
            }))
        }
        clearInterval(delay)
    }

    const handleDelay=()=>{
        delay=setTimeout(()=>{
            console.log("System Stopped...")
        },1800000)
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
            <div className={`d-flex justify-content-center w-100`}>
                <h1 className={`m-0`}>Explosion Risk Management System<Dot></Dot>Sensor Status<Dot></Dot>
                    <Button className={`bg-dark border-dark`} onClick={handleShow}><List className={`bg-dark`}></List></Button><Dot className={`${oilData.oilStatus==="GOOD"&&gasData.gasStatus==="GOOD"?"d-none":""}`}></Dot>
                    <Button onClick={handleAlert} type="button" variant="danger" className={`bg-danger ${oilData.oilStatus==="GOOD"&&gasData.gasStatus==="GOOD"?"d-none":""}`}>Stop Alert</Button>
                </h1>
            </div>
            <Container className={`m-0 p-0 d-flex justify-content-center align-items-center h-100 mt-4`}>
                <Row className={`m-0 p-0 w-100`}>
                    <Col xl={6} className={`m-0 p-0 d-flex justify-content-center align-items-center flex-column`}>
                        <div className={`${style.status} ${oilData.oilStatus==="GOOD"?style.good:style.bad}`}>
                            <div className={`${oilData.oilStatus==="GOOD"?style.goodExp:style.badExp}`}></div>
                            <div className={`${style.content} w-100 h-100`}>{`${oilData.oilStatus==="GOOD"?oilData.oilValue:"X"}`}<div className={`${style.unit}`}>units</div></div>
                        </div>
                        <div className={`${style.contentDown}`}>
                            <div>Sensor ID: HINCORP_S01_OIL</div>
                            <div>Status: {oilData.oilStatus}</div>
                            <div>Sensed Time: {oilData.timeStamp}</div>
                        </div>
                    </Col>
                    <Col xl={6} className={`m-0 p-0 d-flex justify-content-center align-items-center flex-column`}>
                    <div className={`${style.status} ${gasData.gasStatus==="GOOD"?style.good:style.bad}`}>
                            <div className={`${gasData.gasStatus==="GOOD"?style.goodExp:style.badExp}`}></div>
                            <div className={`${style.content} w-100 h-100`}>{`${gasData.gasStatus==="GOOD"?gasData.gasValue:"X"}`}<div className={`${style.unit}`}>units</div></div>
                        </div>
                        <div className={`${style.contentDown}`}>
                            <div>Sensor ID: HINCORP_S02_GAS</div>
                            <div>Status: {gasData.gasStatus}</div>
                            <div>Sensed Time: {gasData.timeStamp}</div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                <Offcanvas.Title><h2>Menu</h2></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className={`p-0`}>
                    <ListGroup className={`border-0`} variant="flush">
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="dark" active action href="/sensorStatus">
                            <DeviceSsd className={`me-2`}></DeviceSsd><b>Sensor Status</b>
                        </ListGroup.Item>
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="light" action href="/employeeStatus">
                            <People className={`me-2`}></People><b>Employee Status</b>
                        </ListGroup.Item>
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="light" action href="/employeeManagement">
                            <Book className={`me-2`}></Book><b>Employee Management</b>
                        </ListGroup.Item>
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`}>
                            <Button onClick={handleLogout} type="button" variant="dark" className="bg-dark w-100">Logout</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
            {/* <div>
                {(oilData.oilStatus==="BAD"||gasData.gasStatus==="BAD")&&<audio src={alertSiren} autoPlay loop></audio>}
            </div> */}
        </div>
    )
}

export default Sensor
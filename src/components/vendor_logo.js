import React, { useEffect } from "react";
import { Image} from "react-bootstrap";
import AOS from 'aos';
import 'aos/dist/aos.css';
const VenderLogo = ({src, url,text, addedDuration}) =>{
    useEffect(()=>{
        AOS.init({duration:900});
        AOS.refresh();
    }, []);
    return (
        <div style={{margin: 'auto',width:'200px',height:'200px',padding:'3%',paddingBottom:'3vh',paddingTop:'25px',paddingRight:'35px',textAlign:'center',overscrollBehavior: 'auto'}} data-aos='fade-up' data-aos-easing="ease-in-sine">
            <a href={url} target="_blank" style={{textDecoration:"none",color:'black',fontSize:'1em'}}>
                <Image src={src} width='100%' height='100%' alt={src} style={{borderRadius:'20px'}}/>{text}
            </a>
        </div>
        
    );
};
export default VenderLogo;
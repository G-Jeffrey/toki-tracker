import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
const CarImg = ({url, credits})=>{
    return (
        <>
            <img className="d-block w-100" src={url}/>
            <Carousel.Caption>
                Image by by {credits}
            </Carousel.Caption>
        </>
    )
}
export default CarImg;
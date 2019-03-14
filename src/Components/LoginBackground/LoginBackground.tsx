import React from 'react';


const LoginBackground = (props: any) => (
    <div className="Login__grid" >
        <div className="Login__grid-inner" style={{backgroundColor: props.background}} />
            <div className="Login__grid-inner" style={{backgroundColor: props.background}}>
                <img className="Login__grid-logo" src={props.img} alt="cementDAO logo" />
                <p className="Login__grid-title">{props.title}</p>
                <p className="Login__grid-content">
                    {props.content}
                </p>
                <div className="Login__button-flex">
                    {/* <img className="Login__button" src={props.nextButtonImg}  onClick={props.nextSlide}  /> */}
                </div>
            </div>
    </div>
);

export default LoginBackground;

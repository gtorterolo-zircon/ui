import React, { Component } from 'react';

import {PopupDiv, Popup__image, Popup__content, Popup__close_button, Popup__message, Popup__content_cancelled, Popup__title} from './PopupStyles';


import ErrorPopupImg from '../../Assets/img/error-popup-image.svg';
import SuccessPopupImg from '../../Assets/img/success-popup-image.svg';
import blackCloseButton from '../../Assets/img/x-button.svg';


interface IPopupProps {
    status: string;
    color: boolean;

}

class Popup extends Component<IPopupProps, {}> {
    public render() {
        let image;
        let content;
        let closeButton;
        console.log(this.props);
        if (this.props.status === 'error') {
            image = ErrorPopupImg;
            content = this.errorContent();
            closeButton = this.blackCloseButton();
        } else if (this.props.status === 'inProgress') {
            image = SuccessPopupImg;
            content = this.inProgressContent();
            closeButton = this.whiteCloseButton();
        }
        return (
            <PopupDiv>
                <Popup__content background={this.props.color}>

                    <Popup__image src={image} />
                    <div>{content}

                    </div>
                    <div>{closeButton}</div>
                </Popup__content>
            </PopupDiv>
        );
    }

    private blackCloseButton = () => {
        return <React.Fragment>
        <Popup__close_button src={blackCloseButton} alt="" />
        </React.Fragment>
    }

    private whiteCloseButton = () => {
        return <React.Fragment>
        <Popup__close_button src={blackCloseButton} alt="" />
        </React.Fragment>
    }

    private inProgressContent = () => {
        return <React.Fragment>
            <Popup__message>
                <Popup__title>In progress</Popup__title>
                <Popup__content_cancelled>There was an error proccessing your <br />transaction.</Popup__content_cancelled>
                <Popup__content_cancelled>Funds have not been drawn from your <br />account.</Popup__content_cancelled>
                <Popup__content_cancelled>Please try again.</Popup__content_cancelled>
            </Popup__message>
        </React.Fragment>
    }

    private errorContent = () => {
        return <React.Fragment>
            <Popup__message>
                <Popup__title>CANCELLED</Popup__title>
                <Popup__content_cancelled>There was an error proccessing your <br />transaction.</Popup__content_cancelled>
                <Popup__content_cancelled>Funds have not been drawn from your <br />account.</Popup__content_cancelled>
                <Popup__content_cancelled>Please try again.</Popup__content_cancelled>
            </Popup__message>
        </React.Fragment>
    }
};



export default Popup;

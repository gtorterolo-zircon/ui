import React, { Component } from 'react';

import {
    PopupDiv, Popup__image, Popup__content, Popup__close_button, Popup__message,
    Popup__content_cancelled, Popup__title_white, Popup__content_inProgress, Popup__content_inProgressTitle,
    Popup__content_inProgressGrid, Popup__content_inProgressSpan, Popup__InProgressIcon, Popup__title_red,
    Popup__viewTransaction
} from './PopupStyles';


import blackCloseButton from '../../Assets/img/popup-images/black-close-button.svg';
import ErrorPopupImg from '../../Assets/img/popup-images/error-popup-image.svg';
import inProgessTitle from '../../Assets/img/popup-images/transaction-is-in-process-title.svg';
import SuccessPopupImg from '../../Assets/img/success-popup-image.svg';

import numberOneIcon from '../../Assets/img/popup-images/popup-number-one-icon.svg';
import numberThreeIcon from '../../Assets/img/popup-images/popup-number-three-icon.svg';
import numberTwoIcon from '../../Assets/img/popup-images/popup-number-two-icon.svg';
import whiteCloseButton from '../../Assets/img/popup-images/white-close-button.svg';


/**
 * Popup variables
 */
interface IPopupProps {
    status: string;
    color: boolean;

}

/**
 * This class receives two props
 * @status this variable determines if the popup is success,
 * error or inProgress.
 * @color this determines the background color of the popup.
 */

class Popup extends Component<IPopupProps, {}> {
    public render() {
        let image;
        let content;
        let closeButton;
        if (this.props.status === 'error') {
            image = ErrorPopupImg;
            content = this.errorContent();
            closeButton = this.blackCloseButton();
        } else if (this.props.status === 'inProgess') {
            image = SuccessPopupImg;
            content = this.inProgressContent();
            closeButton = this.whiteCloseButton();
        } else if (this.props.status === 'success') {
            image = SuccessPopupImg;
            content = this.successContent();
            closeButton = this.whiteCloseButton();
        }
        /**
         * @content This is the message that is rendered in each of the popups
         * @closeButton This is a variable which alters the color of the close button
         */
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

    /**
     *  Render the black close button for specific popups
     */

    private blackCloseButton = () => {
        return <React.Fragment>
            <Popup__close_button src={blackCloseButton} alt="" />
        </React.Fragment>;
    }

    /**
     *  Render the white close button for specific popups
     */

    private whiteCloseButton = () => {
        return <React.Fragment>
            <Popup__close_button src={whiteCloseButton} alt="" />
        </React.Fragment>;
    }

    /**
     *  Render the inProgress popup
     */

    private inProgressContent = () => {
        return <React.Fragment>
            <Popup__message>
                <img src={inProgessTitle} alt="" />
                <Popup__content_inProgressTitle>
                    Please do not refresh or navigate away from
                    <br />
                    this screen before you receive confirmation.
                </Popup__content_inProgressTitle>
                <Popup__content_inProgress>
                    <Popup__content_inProgressGrid>
                        <Popup__InProgressIcon src={numberOneIcon} alt="" />
                        <Popup__content_inProgressSpan>Approve a withdrawal by the MIXR</Popup__content_inProgressSpan>
                    </Popup__content_inProgressGrid>
                </Popup__content_inProgress>
                <Popup__content_inProgress>
                    <Popup__content_inProgressGrid>
                        <Popup__InProgressIcon src={numberTwoIcon} alt="" />
                        <Popup__content_inProgressSpan>
                            Inform the MIXR of the deposit,
                            <br />
                            which triggers the withdrawal.
                        </Popup__content_inProgressSpan>
                    </Popup__content_inProgressGrid>
                </Popup__content_inProgress>
                <Popup__content_inProgress>
                    <Popup__content_inProgressGrid>
                        <Popup__InProgressIcon src={numberThreeIcon} alt="" />
                        <Popup__content_inProgressSpan>Receive Confirmation</Popup__content_inProgressSpan>
                    </Popup__content_inProgressGrid>
                </Popup__content_inProgress>

                <Popup__viewTransaction>View transaction</Popup__viewTransaction>
            </Popup__message>
        </React.Fragment>;
    }

    /**
     * Render the success popup
     */

    private successContent = () => {
        return <React.Fragment>
            <Popup__message>
                <Popup__title_white>success</Popup__title_white>
                <Popup__content_inProgressTitle>
                    Your transaction has been processed
                </Popup__content_inProgressTitle>


                <Popup__viewTransaction>View transaction</Popup__viewTransaction>
            </Popup__message>
        </React.Fragment>;
    }

    /**
     * Error popup method
     */

    private errorContent = () => {
        return <React.Fragment>
            <Popup__message>
                <Popup__title_red>cancelled</Popup__title_red>
                <Popup__content_cancelled>
                    There was an error proccessing your
                    <br />
                    transaction.
                </Popup__content_cancelled>
                <Popup__content_cancelled>Funds have not been drawn from your <br />account.</Popup__content_cancelled>
                <Popup__content_cancelled>Please try again.</Popup__content_cancelled>
            </Popup__message>
        </React.Fragment>;
    }
}



export default Popup;

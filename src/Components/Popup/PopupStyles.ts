import styled from 'styled-components';

interface IpropsPopupDiv {
    background: boolean;
}

export const PopupDiv = styled.div `
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.6);
`;


export const Popup__image  = styled.img `
    display: block;
    margin: auto;
    height: 200px;
    width: 200px;
`;

export const Popup__content = styled.div `
    display: grid;
    grid-template-columns: 50% 48% auto;
    margin: 12% auto;
    padding: 24px;
    width: 60%;
    height: 50%;
    background-color: ${(props: IpropsPopupDiv) => props.background ? '#00d0de' : '#fff'}
    padding-bottom: 40px;
`;

export  const Popup__message = styled.p `
    padding-top: 50px;
`;

export const Popup__title = styled.p `
    font-size: 24px;
`;

export const Popup__Title_black = styled.p `
    margin-bottom: 24px;
`;

export const Popup__content_cancelled = styled.p `
    margin: 10px 0px;
    font-size: 14px;
    line-height: 16px;
`;

export const Popup__close_button = styled.img `
    height: 18px;
`;

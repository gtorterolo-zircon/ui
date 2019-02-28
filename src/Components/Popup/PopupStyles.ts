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

export  const Popup__message = styled.div `
    padding-top: 50px;
`;

export const Popup__title = styled.p `
    font-size: 24px;
`;

export const Popup__title_red = styled.p `
    margin-bottom: 24px;
    font-size: 20px;
    letter-spacing: 4px;
    color: #ff006c;
`;

export const Popup__content_cancelled = styled.p `
    margin: 10px 0px;
    font-size: 14px;
    line-height: 16px;
`;

export const Popup__content_inProgress = styled.p `
    color: #fff;
    padding: 10px 0px;
`;

export const Popup__content_inProgressTitle = styled.p `
    color: #fff;
    padding: 12px 0px;
    font-size: 13px;
    line-height: 18px;
`;

export const Popup__content_inProgressGrid = styled.div `
    display: grid;
    grid-template-columns: 50px auto;
`;

export const Popup__content_inProgressSpan = styled.span `
    font-size: 13px;
    padding-top: 10px;
    line-height: 16px;
`;

export const Popup__viewTransaction = styled.p `
    text-decoration: underline;
    color: #fff;
    font-size: 12px;
    font-weight: 100;
`;

export const Popup__close_button = styled.img `
    height: 18px;
`;

export const Popup__InProgressIcon = styled.img `
    height: 30px;
`;

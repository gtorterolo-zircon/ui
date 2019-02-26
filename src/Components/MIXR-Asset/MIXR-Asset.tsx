import React, { Component } from 'react';

const MIXRAsset = (props: any) =>  (
        <div className="MIXR-Asset__grid" onClick={props.click}>
            <div className="MIXR-Asset__content--white--top-padding">{props.assetName}</div>
            <div>
                <p className="MIXR-Asset__title">RECEIVE</p>
                <p className="MIXR-Asset__content--top-padding">{props.receive}</p>
            </div>
            <div>
                <p className="MIXR-Asset__title">- FEE</p>
                <p className="MIXR-Asset__content--small">{props.fee}</p>
            </div>
            <div>
                <p className="MIXR-Asset__title">TOTAL</p>
                <p className="MIXR-Asset__content--white">{props.total}</p>
            </div>
        </div>
    );

export default MIXRAsset;

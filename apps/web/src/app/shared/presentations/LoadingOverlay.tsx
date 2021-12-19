import { ComponentProps } from "../models/component";
import React, { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

interface LoadingOverlayProps {
  loading: boolean;
  text: string;
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  display: '',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 2,
  cursor: 'pointer',
};

const textStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  fontSize: '50px',
  color: 'white',
  transform: 'translate(-50%,-50%)',
  textAlign: 'center'
}

function LoadingOverlay({ children, loading, text }: ComponentProps<LoadingOverlayProps>) {
  if (!loading) {
    return (<>{children}</>);
  }
  return (
    <>
      {children}
      <div style={overlayStyle}>
        <div style={textStyle}>
          <ClipLoader color={'#4e73df'} loading={loading} size={50}/>
          <h5>{text}</h5>
        </div>
      </div>
    </>
  )
}

export default LoadingOverlay;

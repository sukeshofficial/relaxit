import type {Logo } from "../types/logo.types";
import "../App.css";

interface WrapperProps {
  logo: Logo;
}

export default function Wrapper({logo}: WrapperProps) {
  return(
    <>
    <div className="header">
      <img src={logo.url} alt={logo.type} className="wordmark"/>
    </div>
    </>
  )
}
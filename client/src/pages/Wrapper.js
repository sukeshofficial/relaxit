import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import "../App.css";
export default function Wrapper({ logo }) {
    return (_jsx(_Fragment, { children: _jsx("div", { className: "header", children: _jsx("img", { src: logo.url, alt: logo.type, className: "wordmark" }) }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../styles/loadingScreen.css";
export default function LoadingScreen({ logoUrl, progress = 100, }) {
    const value = Math.max(0, Math.min(progress, 100));
    return (_jsx("main", { className: "loading-screen", children: _jsxs("div", { className: "loading-content", children: [_jsx("img", { src: logoUrl, alt: "Relaxit", className: "loading-logo" }), _jsx("div", { className: "loading-line", children: _jsx("div", { className: "loading-line-inner" }) }), _jsx("p", { className: "loading-text", children: "Preparing your experience" })] }) }));
}

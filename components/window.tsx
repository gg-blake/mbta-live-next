import BrowserNotSupported from "./brwser-err"

export default function Window({children, isCompat}) {
    if (isCompat) {
        return <>{children}</>
    } else {
        return <BrowserNotSupported />
    }
}
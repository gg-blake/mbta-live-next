import BrowserNotSupported from "./brwser-err"

export default function Window({children, isCompat}: {children: any, isCompat: boolean}) {
    if (isCompat) {
        return <>{children}</>
    } else {
        return <BrowserNotSupported />
    }
}
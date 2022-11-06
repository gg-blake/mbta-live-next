export default function Navigation({ color }: {color: string}) {
    const defaultColor = 'bg-['+color+']';
    const Ping = () => <span className="animate-ping bg-blue-500 w-2 h-2 absolute left-[-4px] top-[-4px] rounded-full"></span>;

    const css = `
    .bg-default {
        background-color: ${color+"45"};
        color: ${color};
        border-color: ${color};
    }
    .grid-label {
        color: ${color};
    }
    .subway-select {
        border: 1px dashed ${color};
    }
    `

    return (
        <div className="w-full h-auto flex justify-center">
            <style>{css}</style>
            <div className="subway-select w-auto h-auto grid grid-cols-4 font-Inter font-light text-md gap-2 p-4">
                <div className="grid-label col-span-4 h-auto py-[2px] font-Inter font-medium text-lg text-center">Subway Selection</div>
                <a className={`bg-default border-[1px] w-auto h-full hover:bg-[#DA291C] hover:text-white hover:border-transparent shadow-md rounded-md transition-colors flex justify-center items-center px-4 py-2 relative`} href="/red">Red</a>
                <a className={`bg-default border-[1px] w-auto h-full hover:bg-[#FA902D] hover:text-white hover:border-transparent shadow-sm rounded-md transition-colors flex justify-center items-center px-4 py-2 relative`} href="/orange">Orange</a>
                <a className={`bg-default border-[1px] w-auto h-full hover:bg-[#3551DE] hover:text-white hover:border-transparent shadow-sm rounded-md transition-colors flex justify-center items-center px-4 py-2 relative`} href="/blue">Blue</a>
                <a className={`bg-default border-[1px] w-auto h-full hover:bg-[#139C13] hover:text-white hover:border-transparent shadow-sm rounded-md transition-colors flex justify-center items-center px-4 py-2 relative`} href="/green">Green</a>
            </div>
        </div>
    )
}
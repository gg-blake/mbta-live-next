import PEPEHANDS from '../public/pepehands.png';
import Image from 'next/image';

export default function BrowserNotSupported() {
    return (
        <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-center items-center gap-4">
            <div className='relative w-[15vw] h-[15vw] flex items-end'>
                <Image
                    layout="intrinsic"
                    src={PEPEHANDS}
                    alt="PepeHands emoji"
                />
            </div>
            <h1 className='font-PublicSans text-lg bold lg:text-xl text-white text-center'>Oops..</h1>
            <p className="font-Inter text-xs lg:text-sm text-white text-center">Looks like your browser isn&apos;t supported by this site yet. <br />Try <a className="underline text-blue-500" href="https://www.firefox.com">Firefox</a> instead.</p>
        </div>
    )
}
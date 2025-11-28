"use client";
import { ArellanoLogo } from "@/icons"

export default function ArellanoLoader() {
    
    return (
        <>     
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-28 h-28 border-8 text-[#A2BF3D] text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-[#A2BF3D] rounded-full">
                    <ArellanoLogo fillColor={"#FFFFFF"}/>
                </div>
            </div> 
        </>
    )
}
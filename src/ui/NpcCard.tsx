"use client"
import Npc from "@/lib/types/Npc"
import Dictaphone from "./Dictaphone"

export const NpcCard = ({ npc }: {npc: Npc}) => {


    return (
        <>
            <div className="max-w-xs mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* <!-- Image --> */}
                <div className="w-full h-48 bg-gray-200">
                    <img className="object-cover w-full h-full" src={npc.picture} alt="Profile Picture" />
                </div>

                {/* <!-- Name --> */}
                <div className="p-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">{npc.name}</h2>
                </div>
            </div>
        </>
    )

}
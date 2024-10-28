import Npc from "@/lib/types/Npc"
import Image from 'next/image'

export const NpcCard = ({ npc }: {npc: Npc}) => {


    return (
        <>
            <div className="max-w-xs mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* <!-- Image --> */}
                <div className="w-full h-48 bg-gray-200">
                    <Image src={npc.picture} width={150} height={150} alt="Profile Picture" />
                </div>

                {/* <!-- Name --> */}
                <div className="p-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">{npc.name} {npc.lastName}</h2>
                </div>
            </div>
        </>
    )

}
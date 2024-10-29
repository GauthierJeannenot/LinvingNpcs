'use client'
import Dictaphone from "@/ui/Dictaphone"
import { npcDatas } from "@/lib/data/npcDatas"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import NpcType from "@/lib/types/Npc"
import { Suspense } from "react"

export default function Npc() {
    const param = useParams()

    const [npc, setNpc] = useState<NpcType>({name:"", picture:"", personae:"", lastName:""})

    useEffect(() => {
        const response = npcDatas.find(npc => npc.name === param.npc)
        if (response) setNpc(response)
    }, [])

    
    return(
        <div className="flex items-center justify-center"> 
            <div className="flex-col">
                <h1>{npc.name} {npc.lastName}</h1>
                {
                <Suspense fallback={<div>Loading...</div>}>
                    <Dictaphone npc={npc} />
                </Suspense>
                } 
            </div>
                
        </div>

    )
}
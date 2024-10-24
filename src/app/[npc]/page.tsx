'use client'
import Dictaphone from "@/ui/Dictaphone"
import { npcDatas } from "@/lib/data/npcDatas"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import NpcType from "@/lib/types/Npc"

export default function Npc() {
    const param = useParams()

    const [npc, setNpc] = useState<NpcType>({name:"", picture:"", personae:""})

    useEffect(() => {
        const response = npcDatas.find(npc => npc.name === param.npc)
        if (response) setNpc(response)
    }, [])

    
    return(
        <> 
            <h1>{npc.name}</h1>
           {<Dictaphone npc={npc}/>}     
        </>

    )
}
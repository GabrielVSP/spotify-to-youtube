"use client"

import Generate from "@/components/generate";
import axios from "axios";
import { useState } from "react";

export default function Home() {

  const [data, setData] = useState<any>()

  const get = async () => {

    const albumData = await axios.get("http://localhost:3000/api/album/5RKDlGGlfI4ylZDmJpzGlv")
    // const playlist = await axios.post("http://localhost:3000/api/playlist")

    const jsonString = JSON.stringify(albumData)
    const base64 = Buffer.from(jsonString).toString('base64')

    const videosid = await axios.get("http://localhost:3000/api/video?data="+base64)
    const videosInsert = await axios.post("http://localhost:3000/api/video", {
      playlistId: 'PLjy5IMbY0Q7-Gzy5akZ3qGs-Zwqwven7z',
      songsId: videosid
    })

    setData(videosInsert)

  }

  return (

    <main>

      <header className="p-2 py-5 bg-slate-900">
        <h1 className="text-3xl text-green-500 p-1">Album Bridge</h1>
      </header>

      <Generate gen={get} data={data} />

    </main>
    
  );
}

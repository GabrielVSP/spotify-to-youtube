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

    setData(videosid)

  }

  return (

    <main>

      <Generate gen={get} data={data} />

    </main>
    
  );
}

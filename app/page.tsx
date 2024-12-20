"use client"
import Generate from "@/components/generate";
import axios from "axios";
import { useState } from "react";

export default function Home() {

  const [data, setData] = useState<any>()

  const get = async () => {

    const res = await axios.get("http://localhost:3000/api/album/5RKDlGGlfI4ylZDmJpzGlv")

    setData(res.data)

  }

  return (

    <main>

      <Generate gen={get} data={data} />

    </main>
    
  );
}

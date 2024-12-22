"use client"

import { faBridge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Roboto } from "next/font/google";
import { useState } from "react";

const roboto = Roboto({ subsets: ['latin'], weight: '400' })

export default function Home() {

  const [data, setData] = useState<{}>()

  const get = async () => {

    // const albumData = await axios.get("http://localhost:3000/api/album/5RKDlGGlfI4ylZDmJpzGlv")
    // // const playlist = await axios.post("http://localhost:3000/api/playlist")

    // const jsonString = JSON.stringify(albumData)
    // const base64 = Buffer.from(jsonString).toString('base64')

    // const videosid = await axios.get("http://localhost:3000/api/video?data="+base64)
    // const videosInsert = await axios.post("http://localhost:3000/api/video", {
    //   playlistId: 'PLjy5IMbY0Q7-Gzy5akZ3qGs-Zwqwven7z',
    //   songsId: videosid
    // })

    // setData(videosInsert)

  }

  return (

    <main>

      <section id="wave" className="!fixed">
        <div className='air air1'></div>
        <div className='air air2'></div>
        <div className='air air3'></div>
        <div className='air air4'></div>
      </section>

      <header className="p-2 py-5 mb-5 absolute">
        <div className="flex items-center justify-center flex-col w-fit text-white">
          <h1 className="text-3xl p-1" style={{fontFamily: roboto.style.fontFamily}}>Album Bridge</h1>
          <FontAwesomeIcon icon={ faBridge } className="text-3xl" />
        </div>
      </header>

      <section className="h-[50vh] flex flex-col items-center justify-center w-full absolute" style={{fontFamily: roboto.style.fontFamily}}>

        <h2 className="text-indigo-200 text-xl mb-3">Para converter o álbum basta inserir o link dele logo abaixo.</h2>

        <form className="w-full flex items-center justify-center">
          <input type="text" className="p-2 rounded-xl bg-white w-1/3 border hover:border-indigo-800 focus:border-indigo-500 hover:border-5 duration-500" />
        </form>

        <div className="text-lg">
          <p className="text-">Algo deu errado :(</p>
        </div>

      </section>

      

    </main>
    
  );
}

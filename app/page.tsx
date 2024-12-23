"use client"

import { faBridge, faHourglass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import clsx from "clsx";
import { Roboto } from "next/font/google";
import { useState } from "react";

const roboto = Roboto({ subsets: ['latin'], weight: '400' })

export default function Home() {

  const [data, setData] = useState<{'color': string, 'text': string}>({color: '', text: ''})
  const [info, setInfo] = useState<any>()
  const [input, setInput] = useState<string>()

  const get = async (e: any) => {

    e.preventDefault()

    try {

      const url = input?.split('/').pop()

      await setData({
        color: 'yellow-500',
        text: `Adquirindo informações do álbum...`
      })

      const albumData = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}api/album/${url}`)

      await setData({
        color: 'yellow-500',
        text: 'Criando playlist...'
      })

      const playlist: { data: {id: string}} = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}api/playlist`)

      // await setData({
      //   color: 'yellow-500',
      //   text: 'Adquirindo informações dos vídeos'
      // })

      // const jsonString = await JSON.stringify(albumData)
      // const base64 = await Buffer.from(jsonString).toString('base64')

      // const videosid = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}api/video?data=${base64}`)

      // const videosInsert: { data: { playlistUrl: string } } = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}api/video`, {
      //   playlistId: playlist.data.id,
      //   songsId: videosid
      // })

      // setInfo(videosInsert)

      // setData({
      //   color: 'green-500',
      //   text: "Aqui está a sua playlist: " + videosInsert.data.playlistUrl
      // })

    } catch {

      setData({
        color: 'red-500',
        text: 'Parece que algo deu errado. Por favor tente novamente.'
      })

    }

  }

  return (

    <main>

      <section id="wave" className="!fixed">
        <div className='air air1'></div>
        <div className='air air2'></div>
        <div className='air air3'></div>
        <div className='air air4'></div>
      </section>

      <header className="p-2 py-5 mb-5 absolute max-sm:w-full max-sm:flex max-sm:justify-center max-sm:items-center">
        <div className="flex items-center justify-center flex-col w-fit text-white">
          <h1 className="text-3xl p-1" style={{fontFamily: roboto.style.fontFamily}}>Album Bridge</h1>
          <FontAwesomeIcon icon={ faBridge } className="text-3xl" />
        </div>
      </header>

      <section className="h-[50vh] flex flex-col items-center justify-center w-full absolute text-center" style={{fontFamily: roboto.style.fontFamily}}>

        <h2 className="text-indigo-200 text-xl mb-3">Para converter o álbum basta inserir o link dele logo abaixo.</h2>

        <form className="w-full flex items-center justify-center" onSubmit={get}>
          <input type="text" className="p-2 rounded-xl bg-white w-1/3 max-sm:w-[90%] max-md:w-1/2 border hover:border-indigo-800 focus:border-indigo-500 hover:border-5 duration-500" onChange={(e) => setInput(e.target.value)} />
        </form>

        <div className="text-lg mt-2">
          <p className={clsx(`text-${data.color}`)}>{data.text} { data.color === "yellow-500" && (<FontAwesomeIcon icon={faHourglass} className="text-yellow-500 animate-spin px-1" />)}</p>
        </div>

      </section>

    </main>
    
  );
}

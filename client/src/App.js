import React, { useState } from 'react'
import "./App.css"
import axios from "axios"
function App() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('')

  const generete = async () => {
   
    const responce = await axios.post('/link', {
      url, slug
    })
   

    const shortur = responce?.data?.data.shortUrl
    setShortUrl(shortur)
  }

  const copy = ()=>{
    navigator.clipboard.writeText(shortUrl);
    alert('copy to clipboard')
  }
  return (
    <div>
      <h1 className='title'>Link Shortner</h1>
      <div className='container'>
        <div className='genarate-container'>
          <p className='generation-name'>Generate Your Link</p>

          <input type='text'
            placeholder='URL'
            className='in-box'
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
            }}
          />

          <input type='text'
            placeholder='Slug'
            className='in-box'
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
            }}
          />


          <p className='your-link'>Short URL👇</p>
          <div className='copy-contain'>
            <input placeholder='Short URL'
              className='linkbox'
              value={shortUrl}
            />
            <img className='copy' onClick={copy} src='https://www.pnx-spb.ru/images/copy-btn.svg' />
          </div>
          <button type='button' onClick={generete} className='short-btn'>Create Short URL</button>
        </div>



        <div><p>History</p></div>
      </div>
    </div>
  )
}

export default App
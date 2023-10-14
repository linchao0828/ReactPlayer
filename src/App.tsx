import React, { useState, useRef } from 'react';
import { Player, PlayerRef } from "@remotion/player";
import { MyVideo, myVideoSchema } from "./features/remotion/MyVideo";
import { MyPoster } from "./features/remotion/MyPoster";
import './App.css';

export const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const App: React.FC = () => {
  const [titleText, setTitleText] = useState("Try editing me!")
  const [audioUrl, setAudioUrl] = useState("")
  const playerRef = useRef<PlayerRef>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (playerRef.current) {
      playerRef.current.pause();
    }

    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const theTitleText = (formJson["titleText"] as string).trim();
    setTitleText(theTitleText);

    try {
      await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'post',
        headers: {
          'Xi-Api-Key': process.env.REACT_APP_ELEVENLABS_XI_API_KEY as string,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: theTitleText,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 1,
            similarity_boost: 1
          }
        })
      }).then(response => response.blob())
        .then(blob => {
          blobToBase64(blob).then(base64 => {
            setAudioUrl(base64 as string);
          })
        }).catch(e => {
          console.log(e)
        })
    } catch (error) {
      console.error(error);
    }

    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        <form method="post" onSubmit={handleSubmit}>
          <label>
            <input className="App-input" name="titleText" defaultValue="Try editing me!" />
          </label>
          <hr />
          <button className="App-btn" type="submit">replay</button>
        </form>
      </div>
      <Player
        ref={playerRef}
        component={MyVideo}
        renderPoster={MyPoster}
        showPosterWhenPaused
        durationInFrames={450}
        compositionWidth={680}
        compositionHeight={600}
        fps={30}
        autoPlay={true}
        loop={true}
        className={"App-content"}
        schema={myVideoSchema}
        inputProps={{
          titleText: titleText,
          titleColor: "#FFF",
          audioUrl: audioUrl,
        }}
      />
    </div>
  );
}

export default App;

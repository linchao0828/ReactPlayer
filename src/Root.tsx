import { Composition } from 'remotion';
import { MyVideo, myVideoSchema } from "./features/remotion/MyVideo";
import { blobToBase64 } from "./App";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={450}
        fps={30}
        width={680}
        height={600}
        schema={myVideoSchema}
        defaultProps={{
          titleText: "Try editing me!",
          titleColor: "#FFF",
          audioUrl: "",
        }}
        calculateMetadata={async ({ props, abortSignal }) => {
          const resp = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
            method: 'post',
            headers: {
              'Xi-Api-Key': process.env.REACT_APP_ELEVENLABS_XI_API_KEY as string,
              'Content-Type': 'application/json',
              Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
              text: props.titleText,
              model_id: "eleven_monolingual_v1",
              voice_settings: {
                stability: 1,
                similarity_boost: 1
              }
            })
          })
          const blob = await resp.blob();
          const audioUrl = await blobToBase64(blob).then(base64 => {
            return base64 as string;
          })
          // const audioUrl = URL.createObjectURL(blob);
          console.log(audioUrl);
          return {
            props: {
              ...props,
              audioUrl,
            },
          };
        }}
      />
    </>
  );
}


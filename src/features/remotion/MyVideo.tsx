import { OffthreadVideo, AbsoluteFill, Sequence, Audio } from "remotion";
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';
import { Title } from "./Title";

export const myVideoSchema = z.object({
  titleText: z.string(),
  titleColor: zColor(),
	audioUrl: z.string(),
});

export const MyVideo: React.FC<z.infer<typeof myVideoSchema>> = ({
  titleText,
  titleColor,
  audioUrl,
}) => {
  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <OffthreadVideo src={"https://assets-static.invideo.io/files/Stock_Footage2x_V2_78c7e1c798.mp4"} />
      </AbsoluteFill>
      <Sequence from={15}>
        <Title titleText={titleText} titleColor={titleColor} />
      </Sequence>
      {audioUrl && (
				<Audio volume={0.8} id="ttsAudio" src={audioUrl}/>
			)}
    </AbsoluteFill>
  );
};
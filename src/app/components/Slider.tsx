import React from "react";
import { RoundSlider, ISettingsPointer } from "mz-react-round-slider";

interface SliderProps {
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ onChange }) => {
  const [pointers, setPointers] = React.useState<ISettingsPointer[]>([
    { value: 0 },
  ]);

  const handleSliderChange = (newPointers: ISettingsPointer[]) => {
    setPointers(newPointers);
    const pointerValue =
      typeof newPointers[0]?.value === "number" ? newPointers[0]?.value : 0;
    onChange(pointerValue);
  };

  return (
    <RoundSlider
      min={0}
      max={180}
      step={1}
      arrowStep={1}
      pathThickness={40}
      pathStartAngle={160}
      pathEndAngle={20}
      pointerRadius={30}
      textColor={"#eeeeee"}
      textFontSize={24}
      textSuffix=" min"
      textFontFamily={"Helvetica,Arial,sans-serif"}
      pointers={pointers}
      onChange={handleSliderChange}
      enableTicks={true}
      ticksWidth={3}
      ticksHeight={5}
      longerTicksHeight={15}
      ticksCount={36}
      ticksGroupSize={6}
      ticksDistanceToPanel={5}
      ticksColor="#eeeeee"
      tickValuesColor="#eeeeee"
      SvgDefs={
        <>
          <linearGradient id="pointer" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f2c832" />
            <stop offset="100%" stopColor="#f19305" />
          </linearGradient>

          <linearGradient
            id="pointer-selected"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f2c832" />
            <stop offset="100%" stopColor="#f19305" />
          </linearGradient>

          <linearGradient id="connection" x1="0%" y1="100%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d562" />
            <stop offset="100%" stopColor="#36268d" />
          </linearGradient>
        </>
      }
      pointerBgColor={"url(#pointer)"}
      pointerBgColorSelected={"url(#pointer-selected)"}
      connectionBgColor={"url(#connection)"}
    />
  );
};

export default Slider;

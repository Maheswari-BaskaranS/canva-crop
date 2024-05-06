import React, { useState } from 'react';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';

const Konvo = () => {
  const [cropRect, setCropRect] = useState(null);
  const [tagPosition, setTagPosition] = useState({ x: 0, y: 0 });

  const handleDragEnd = (e) => {
    // Update cropRect position
    setCropRect({ x: e.target.x(), y: e.target.y(), width: cropRect.width, height: cropRect.height });
  };

  const handleTagPosition = (e) => {
    // Update tag position
    setTagPosition({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Image
          image="./react shirt.png"
          draggable
          onDragEnd={handleDragEnd}
        />
        {cropRect && (
          <Rect
            x={cropRect.x}
            y={cropRect.y}
            width={cropRect.width}
            height={cropRect.height}
            stroke="red"
          />
        )}
        <Text
          text="Tag"
          x={tagPosition.x}
          y={tagPosition.y}
          draggable
          onDragEnd={handleTagPosition}
        />
      </Layer>
    </Stage>
  );
};

export default Konvo;

import { memo, MutableRefObject } from 'react';
const YourVideoComp = memo(function YourVideoComp({
  yourVideoEl,
}: {
  yourVideoEl: MutableRefObject<HTMLVideoElement | null>;
}) {
  return <video ref={yourVideoEl} muted className="object-cover h-full "></video>;
});

export { YourVideoComp };

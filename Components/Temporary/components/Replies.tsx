import { BsArrowReturnRight } from 'react-icons/bs';

function Replies({ cb, quantity, margin = true }: { quantity: number; cb: () => void; margin?: boolean }) {
  if (!quantity) {
    return null;
  }
  return (
    <div className={`flex ${margin ? 'pl-12' : ''} px-3 items-center text-[#B0B3B8] font-medium`}>
      <BsArrowReturnRight />
      <p className="ml-1 cursor-pointer text-sm" onClick={cb}>
        {quantity} replies
      </p>
    </div>
  );
}

export default Replies;

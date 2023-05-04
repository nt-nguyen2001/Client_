import { TypeReactions } from '@Types/Reactions';
import { IconAngry } from '@Components/icons/ReactIcon/iconAngry';
import { IconCare } from '@Components/icons/ReactIcon/iconCare';
import { IconHaha } from '@Components/icons/ReactIcon/iconHaha';
import { IconLike } from '@Components/icons/ReactIcon/iconLike';
import { IconLove } from '@Components/icons/ReactIcon/iconLove';
import { IconSad } from '@Components/icons/ReactIcon/iconSad';
import { IconWow } from '@Components/icons/ReactIcon/iconWow';

type k = keyof typeof TypeReactions;
export const icon: { [key in k]: JSX.Element } = {
  Angry: <IconAngry />,
  Care: <IconCare />,
  Haha: <IconHaha />,
  Like: <IconLike />,
  Love: <IconLove />,
  Sad: <IconSad />,
  Wow: <IconWow />,
};

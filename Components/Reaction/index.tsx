import { IconAngry } from '@Components/icons/ReactIcon/iconAngry';
import { IconCare } from '@Components/icons/ReactIcon/iconCare';
import { IconHaha } from '@Components/icons/ReactIcon/iconHaha';
import { IconLike } from '@Components/icons/ReactIcon/iconLike';
import { IconLove } from '@Components/icons/ReactIcon/iconLove';
import { IconSad } from '@Components/icons/ReactIcon/iconSad';
import { IconWow } from '@Components/icons/ReactIcon/iconWow';
import { ReactionsComponentProps, TypeReactions } from '@Types/Reactions';
import styles from './reaction.module.scss';

const width = '36px';
const icons: { icon: JSX.Element; type: TypeReactions }[] = [
  { icon: <IconLike width={width} />, type: TypeReactions.Like },
  { icon: <IconLove width={width} />, type: TypeReactions.Love },
  { icon: <IconCare width={width} />, type: TypeReactions.Care },
  { icon: <IconHaha width={width} />, type: TypeReactions.Haha },
  { icon: <IconWow width={width} />, type: TypeReactions.Wow },
  { icon: <IconSad width={width} />, type: TypeReactions.Sad },
  { icon: <IconAngry width={width} />, type: TypeReactions.Angry },
];

function Reaction({ fn }: ReactionsComponentProps) {
  return (
    <section className={styles['wrapper']} onClick={(e) => e.stopPropagation()}>
      {icons.map(({ icon, type }, index) => (
        <div
          key={index}
          className={styles['icon']}
          onClick={(e) => {
            e.stopPropagation();
            fn({ type });
          }}
        >
          {icon}
        </div>
      ))}
      <IconLike />
    </section>
  );
}

export default Reaction;

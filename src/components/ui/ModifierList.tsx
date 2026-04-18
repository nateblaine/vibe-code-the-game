import { formatEffect, getEffectTone, type EffectDisplay } from '../../core/displayText';
import styles from './ModifierList.module.css';

interface ModifierListProps {
  effects: EffectDisplay[];
  inline?: boolean;
}

export function ModifierList({ effects, inline = false }: ModifierListProps) {
  return (
    <ul className={[styles.list, inline ? styles.inline : ''].join(' ')}>
      {effects.map((effect, index) => {
        const tone = getEffectTone(effect);
        return (
          <li
            key={`${effect.stat}-${effect.value}-${effect.type}-${index}`}
            className={[styles.item, tone === 'good' ? styles.good : tone === 'bad' ? styles.bad : styles.neutral].join(' ')}
          >
            {formatEffect(effect)}
          </li>
        );
      })}
    </ul>
  );
}

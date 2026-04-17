import { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { UPGRADES } from '../../content/upgrades';
import type { UpgradeCategory } from '../../types/content';
import styles from './UpgradePanel.module.css';

const CATEGORIES: UpgradeCategory[] = ['tooling', 'automation', 'team', 'product', 'stability', 'growth', 'infra'];

export function UpgradePanel() {
  const gameState = useGameStore(s => s.gameState);
  const buyUpgrade = useGameStore(s => s.buyUpgrade);
  const [activeCategory, setActiveCategory] = useState<UpgradeCategory | 'all'>('all');

  if (!gameState) return null;

  const { cash } = gameState.resources;
  const owned = new Set(gameState.upgradesOwned);

  const filtered = UPGRADES.filter(u => activeCategory === 'all' || u.category === activeCategory);

  function canBuy(upgradeId: string): boolean {
    const u = UPGRADES.find(x => x.id === upgradeId);
    if (!u) return false;
    if (owned.has(upgradeId)) return false;
    if (cash < u.cost) return false;
    if (u.requires) {
      for (const req of u.requires) {
        if (!owned.has(req)) return false;
      }
    }
    return true;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={[styles.tab, activeCategory === 'all' ? styles.activeTab : ''].join(' ')}
          onClick={() => setActiveCategory('all')}
        >
          ALL
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={[styles.tab, activeCategory === cat ? styles.activeTab : ''].join(' ')}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.slice(0, 4).toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map(upgrade => {
          const isOwned = owned.has(upgrade.id);
          const affordable = canBuy(upgrade.id);
          const requiresMet = !upgrade.requires || upgrade.requires.every(r => owned.has(r));

          return (
            <div
              key={upgrade.id}
              className={[
                styles.item,
                isOwned ? styles.owned : '',
                !requiresMet && !isOwned ? styles.locked : '',
              ].join(' ')}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemName}>{upgrade.name}</span>
                <span className={[styles.itemCost, affordable ? 'text-green' : isOwned ? 'text-dim' : 'text-red'].join(' ')}>
                  {isOwned ? 'owned' : `$${upgrade.cost.toLocaleString()}`}
                </span>
              </div>
              <div className={styles.itemDesc}>{upgrade.description}</div>
              {!isOwned && requiresMet && (
                <button
                  className={styles.buyBtn}
                  disabled={!affordable}
                  onClick={() => buyUpgrade(upgrade.id)}
                >
                  {affordable ? 'Purchase' : 'Insufficient funds'}
                </button>
              )}
              {!isOwned && !requiresMet && upgrade.requires && (
                <div className={styles.reqNote}>
                  Requires: {upgrade.requires.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

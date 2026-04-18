import { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { UPGRADES } from '../../content/upgrades';
import type { UpgradeCategory } from '../../types/content';
import { calcUpgradeCost } from '../../core/formulas';
import { ModifierList } from './ModifierList';
import styles from './UpgradePanel.module.css';

const CATEGORIES: UpgradeCategory[] = ['tooling', 'automation', 'team', 'product', 'stability', 'growth', 'infra'];

function getUpgradeName(id: string): string {
  return UPGRADES.find(upgrade => upgrade.id === id)?.name ?? id;
}

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
    if (cash < calcUpgradeCost(gameState!, u.cost)) return false;
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
          const actualCost = calcUpgradeCost(gameState!, upgrade.cost);

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
                  {isOwned ? 'owned' : `$${actualCost.toLocaleString()}`}
                </span>
              </div>
              <div className={styles.itemDesc}>{upgrade.description}</div>
              <div className={styles.itemFlavor}>{upgrade.flavorText}</div>
              {upgrade.effects.length > 0 && (
                <div className={styles.effectsBlock}>
                  <div className={styles.effectsLabel}>Effects</div>
                  <ModifierList effects={upgrade.effects} inline />
                  {upgrade.id === 'auto-triage-queue' && (
                    <div className={styles.specialNote}>Unlocks the Auto-triage toggle in Settings.</div>
                  )}
                </div>
              )}
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
                  Requires: {upgrade.requires.map(getUpgradeName).join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

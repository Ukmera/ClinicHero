"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getItemById, SHOP_CATALOG, ShopItem } from "@/lib/rpg/items";
import { revalidatePath } from "next/cache";

export async function buyItemAction(itemId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  const item = getItemById(itemId);
  if (!item) return { error: "Objet introuvable" };

  const currentGems = user.gems ?? 0;
  if (currentGems < item.price) {
    return { error: `Gemmes insuffisantes ! Il te faut ${item.price} 💎 (tu as ${currentGems} 💎).` };
  }

  // Vérifier le niveau requis
  if (item.requiredLevel && user.user_level < item.requiredLevel) {
    return { error: `Niveau ${item.requiredLevel} requis pour débloquer cet objet !` };
  }

  // Parse inventory
  let inventory: string[] = [];
  try {
    inventory = JSON.parse(user.inventory_json || "[]");
  } catch (e) {
    inventory = ["stethoscope_bronze", "blouse_externe"];
  }

  // Pour les équipements uniques, empêcher le double achat
  if (item.category !== "consumable" && inventory.includes(itemId)) {
    return { error: "Tu possèdes déjà cet équipement !" };
  }

  // Ajouter à l'inventaire
  inventory.push(itemId);
  const newGems = currentGems - item.price;

  // Recalculer les stats maximales
  let bonusHp = 0;
  let bonusMana = 0;

  // Calcul des bonus des équipements possédés
  inventory.forEach((invId) => {
    const it = getItemById(invId);
    if (it && it.category !== "consumable") {
      if (it.bonus.hpMax) bonusHp = Math.max(bonusHp, it.bonus.hpMax);
      if (it.bonus.manaMax) bonusMana = Math.max(bonusMana, it.bonus.manaMax);
    }
  });

  const newHpMax = 100 + bonusHp;
  const newManaMax = 200 + bonusMana;

  // Si c'est un consommable, restaurer immédiatement
  let newHpCurrent = user.hp_current ?? 100;
  let newManaCurrent = user.mana_current ?? 100;

  if (item.category === "consumable") {
    if (item.bonus.hpRestore) {
      newHpCurrent = Math.min(newHpMax, newHpCurrent + item.bonus.hpRestore);
    }
    if (item.bonus.manaRestore) {
      newManaCurrent = Math.min(newManaMax, newManaCurrent + item.bonus.manaRestore);
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      gems: newGems,
      inventory_json: JSON.stringify(inventory),
      hp_max: newHpMax,
      mana_max: newManaMax,
      hp_current: newHpCurrent,
      mana_current: newManaCurrent,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/profile");
  revalidatePath("/");

  return {
    success: true,
    newGems,
    inventory,
    hpMax: newHpMax,
    manaMax: newManaMax,
    hpCurrent: newHpCurrent,
    manaCurrent: newManaCurrent,
    item,
  };
}

export async function useConsumableAction(itemId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non authentifié" };

  const item = getItemById(itemId);
  if (!item || item.category !== "consumable") {
    return { error: "Consommable invalide" };
  }

  let inventory: string[] = [];
  try {
    inventory = JSON.parse(user.inventory_json || "[]");
  } catch (e) {
    inventory = [];
  }

  const itemIndex = inventory.indexOf(itemId);
  if (itemIndex === -1) {
    return { error: "Tu ne possèdes pas cet élixir dans ton inventaire !" };
  }

  // Retirer une unité de l'inventaire
  inventory.splice(itemIndex, 1);

  const hpMax = user.hp_max ?? 100;
  const manaMax = user.mana_max ?? 200;

  let newHpCurrent = user.hp_current ?? 100;
  let newManaCurrent = user.mana_current ?? 100;

  if (item.bonus.hpRestore) {
    newHpCurrent = Math.min(hpMax, newHpCurrent + item.bonus.hpRestore);
  }
  if (item.bonus.manaRestore) {
    newManaCurrent = Math.min(manaMax, newManaCurrent + item.bonus.manaRestore);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      inventory_json: JSON.stringify(inventory),
      hp_current: newHpCurrent,
      mana_current: newManaCurrent,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/profile");
  revalidatePath("/");

  return {
    success: true,
    inventory,
    hpCurrent: newHpCurrent,
    manaCurrent: newManaCurrent,
  };
}

export async function getShopUserDataAction() {
  const user = await getCurrentUser();
  if (!user) return null;

  let inventory: string[] = [];
  try {
    inventory = JSON.parse(user.inventory_json || "[]");
  } catch (e) {
    inventory = ["stethoscope_bronze", "blouse_externe"];
  }

  return {
    id: user.id,
    gems: user.gems ?? 0,
    user_level: user.user_level,
    hp_current: user.hp_current ?? 100,
    hp_max: user.hp_max ?? 100,
    mana_current: user.mana_current ?? 100,
    mana_max: user.mana_max ?? 200,
    inventory,
    character_class: user.character_class || "clerc",
    avatar_id: user.avatar_id || "clerc_1",
  };
}

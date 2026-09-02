import { getShopUserDataAction } from "@/app/actions/shop";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "La Forge d'Équipements • ClinicHero",
  description: "Dépense tes Gemmes pour forger des stéthoscopes légendaires, des blouses et des reliques médicales.",
};

export default async function ShopPage() {
  const userData = await getShopUserDataAction();

  return <ShopClient initialUserData={userData} />;
}

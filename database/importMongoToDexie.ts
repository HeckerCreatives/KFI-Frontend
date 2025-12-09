import { ClientMasterFile } from "../types/types";
import { db } from "./db";

export async function syncClientsToDexie(apiData: any) {
  if (!apiData?.clients) return;

  const clients: ClientMasterFile[] = apiData.clients.map((c: any) => ({
    ...c,
    _id: c._id,
    center: { ...c.center },
    business: { ...c.business },
    beneficiaries: c.beneficiaries ?? [],
    children: c.children ?? [],
    image: c.image ?? undefined,
  }));

  await db.table("clientMasterFile").bulkPut(clients);

  console.log('Sync sucess', clients)

  return true;
}

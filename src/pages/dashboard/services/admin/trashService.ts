import apiClient from "../../../../services/api";

export interface TrashItem {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  tenantId: string | null;
  deletedAt: string;
}

interface ApiSuccess<T> {
  data: T;
}

export async function getTrashItems(): Promise<TrashItem[]> {
  const response = await apiClient.get<ApiSuccess<TrashItem[]>>("/admin/trash");
  return response.data.data;
}

export async function restoreTrashItem(item: TrashItem): Promise<void> {
  await apiClient.patch(
    `/admin/trash/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.entityId)}`,
  );
}

export async function permanentlyDeleteTrashItem(item: TrashItem): Promise<void> {
  await apiClient.delete(
    `/admin/trash/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.entityId)}`,
  );
}

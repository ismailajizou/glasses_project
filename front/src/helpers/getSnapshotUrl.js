import { API_URL } from "@/CONSTANT";

export const getSnapshotUrl = (name) => {
  return `${API_URL}/snapshots/image/${name}`;
};

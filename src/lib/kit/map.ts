export interface PublicKitData {
  id: string;
  name?: string;
  bio?: string;
  [key: string]: any;
}

export const mapKitToPublicData = (kit: any): PublicKitData => {
  // If published_json exists, use it; otherwise use the raw kit data
  const source = kit.published_json || kit;
  
  return {
    id: kit.id,
    name: source.name,
    bio: source.bio,
    ...source,
  };
};

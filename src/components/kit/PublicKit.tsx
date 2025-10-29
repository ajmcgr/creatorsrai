import type { PublicKitData } from '@/lib/kit/map';

interface PublicKitProps {
  data: PublicKitData;
}

const PublicKit = ({ data }: PublicKitProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">{data.name || 'Media Kit'}</h1>
        <p className="text-muted-foreground">{data.bio}</p>
      </div>
    </div>
  );
};

export default PublicKit;

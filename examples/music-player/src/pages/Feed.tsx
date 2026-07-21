import { artists } from "../lib/data";
import { DiscoveryHeader } from "../components/DiscoveryNav";
import { ViewSwitcher, ArtistViews } from "../components/ArtistViews";

export default function Feed() {
  const sorted = [...artists].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div>
      <DiscoveryHeader
        title="Discover artists near San Juan"
        right={<ViewSwitcher />}
      />
      <div className="px-3 pb-8 sm:px-6 lg:px-8">
        <ArtistViews artists={sorted} />
      </div>
    </div>
  );
}

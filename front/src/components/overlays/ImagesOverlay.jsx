import { getSnapshotUrl } from "@/helpers/getSnapshotUrl";
import Snapshot from "../Snapshot";

const ImagesOverlay = ({ isOpen, images, setImages, setShareModal }) => {
    return ( 
        <div
            className={`absolute bg-white flex-grow top-0 bottom-0 left-0 right-0 z-40 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex h-full content-start flex-wrap overflow-scroll">
              {images.length ? (
                images.map(({ id, name }) => (
                  <Snapshot
                    key={id}
                    imageName={name}
                    images={images}
                    share={() => setShareModal({ isOpen: true,  imageSrc: getSnapshotUrl(name)})}
                    setImages={setImages}
                  />
                ))
              ) : (
                <Snapshot imageName={null} />
              )}
            </div>
          </div>
     );
}
 
export default ImagesOverlay;
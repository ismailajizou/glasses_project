import Snapshot from "../Snapshot";

const ImagesOverlay = ({ isOpen, images, setImages, setShareModal }) => {
    return ( 
        <div
            className={`absolute bg-white flex-grow top-0 bottom-0 left-0 right-0 z-40 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-wrap">
              {images.length ? (
                images.map((src, idx) => (
                  <Snapshot
                    key={idx}
                    src={src}
                    images={images}
                    share={() => setShareModal({ isOpen: true, src })}
                    setImages={setImages}
                  />
                ))
              ) : (
                <Snapshot src={null} />
              )}
            </div>
          </div>
     );
}
 
export default ImagesOverlay;
import { useState } from "react";
import { FaFacebookF, FaLink, FaQrcode, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import QRCode from "react-qr-code";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import ModalWrapper from "./ModalWrapper";

const ShareModal = ({ setShareModal, isOpen, src }) => {
  const [copied, setCopied] = useState(false);
  const [QrShown, setQrShown] = useState(false);
  return (
    <ModalWrapper
      closeModal={() => setShareModal({ imageSrc: "", isOpen: false })}
      isOpen={isOpen}
      title="Share this image"
    >
      {src && (
        <div className="mb-4 mx-auto w-full">
          <div className="h-52  w-auto max-h-fit flex justify-center">
            {QrShown ? (
                <div className="relative max-h-full w-auto">
                    <QRCode value={src} title="Capture" size={200} />
                </div>
            ) : (
              <img src={src} alt="snapshot" className="h-full"  />
            )}
          </div>
          <div className="flex flex-wrap max-w-sm my-4 justify-center items-center">
            <FacebookShareButton url={src}>
              <button className="mx-4 my-2 bg-blue-800 hover:bg-blue-700 flex items-center px-4 py-2 rounded font-medium">
                <FaFacebookF className="text-white w-4 h-4" />
                <span className="text-white ml-2">Partager</span>
              </button>
            </FacebookShareButton>
            <WhatsappShareButton url={src}>
              <button className="mx-4 my-2 bg-green-600 hover:bg-green-500 flex items-center px-4 py-2 rounded font-medium">
                <FaWhatsapp className="text-white w-4 h-4" />
                <span className="text-white ml-2">Whatsapp</span>
              </button>
            </WhatsappShareButton>
            <EmailShareButton url={src}>
              <button className="mx-4 my-2 bg-red-600 hover:bg-red-500 flex items-center px-4 py-2 rounded font-medium">
                <SiGmail className="text-white w-4 h-4" />
                <span className="text-white ml-2">Email</span>
              </button>
            </EmailShareButton>
            <button
              onClick={() => {
                navigator.clipboard.writeText(src);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              className="mx-4 my-2 bg-yellow-500 hover:bg-yellow-400 flex items-center px-4 py-2 rounded font-medium"
            >
              <FaLink className="text-white w-4 h-4" />
              <span className="text-white ml-2">
                {copied ? "Lien copié" : "Copier lien"}
              </span>
            </button>
            <button
              onClick={() => {
                setQrShown(!QrShown);
              }}
              className="mx-4 my-2 bg-gray-900 hover:bg-gray-800 flex items-center px-4 py-2 rounded font-medium"
            >
              <FaQrcode className="text-white w-4 h-4" />
              <span className="text-white ml-2">
                {QrShown ? "Afficher image" : " Afficher code QR"}
              </span>
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export default ShareModal;

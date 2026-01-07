import Image from "next/image";
import backImage from "@icons/return.svg";
import "./ReturnButton.css";

export default function ReturnButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick} title="Volver">
      <Image src={backImage} alt="Volver" width="20" height="20" />
    </button>
  );
}

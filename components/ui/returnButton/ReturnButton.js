import Image from "next/image";
import backImage from "@icons/return.svg";

export default function ReturnButton({ onClick }) {
  return (
    <button onClick={onClick} title="Volver" >
      <Image src={backImage} alt="Volver" />
    </button>
  );
}

import './Button.css';

export default function Button({onClick, text, type = "primary"}) {
  let cssClass;

  switch (type) {
    case "primary": 
      cssClass = "primary-button";
      break;
    case "secondary": cssClass = "secondary-button";
  }

  return <button className={cssClass} onClick={onClick}> {text} </button>;
}
import * as Icons from "@mui/icons-material"; // Import all icons from Material-UI

type ButtonProps = {
  children: string;
  disabled?: boolean;
  press?: () => void;
  type: "Accept" | "Success" | "Emphasize" | "Reject" | "Ghost";
  src?: keyof typeof Icons; // Specify the type of icon prop as a key of the imported icons
};

export default function Button({
  children,
  disabled,
  press = () => {},
  type = "Ghost",
  src, // Rename the icon prop to iconName for better readability
}: ButtonProps) {
  let buttonClass = "flex justify-center py-2 px-4 rounded-md text-white";

  switch (type) {
    case "Accept":
      buttonClass += " bg-green-500";
      break;
    case "Success":
      buttonClass += " bg-blue-500";
      break;
    case "Emphasize":
      buttonClass += " bg-yellow-500 text-black";
      break;
    case "Reject":
      buttonClass += " bg-red-500";
      break;
    case "Ghost":
      buttonClass += " bg-transparent border-2 border-blue-500 text-blue-500";
      break;
    default:
      break;
  }

  let Icon;
  if (src && Icons[src]) {
    Icon = Icons[src];
  }

  return (
    <button disabled={disabled} onClick={press} className={buttonClass}>
      {Icon && <Icon />}
      <span className="mx-2 font-semibold">{children}</span>
    </button>
  );
}

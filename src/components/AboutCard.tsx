import { Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

export default function AboutCard({
  icon,
  title,
  details = "",
  hiddenDetails = "",
}: AboutCardType) {
  return (
    <div className="flex flex-col gap-y-2 items-center p-2">
      <div className="flex items-end gap-2 capitalize text-xs">
        <Icon boxSize={8} as={icon} />
        <div className="text-center">
          {details}
          <br />
          <span className="text-2xs">{hiddenDetails}</span>
        </div>
      </div>
      {title}
    </div>
  );
}

interface AboutCardType {
  icon: IconType;
  title: string;
  details: string;
  hiddenDetails?: string;
}

import { Icon } from "@chakra-ui/icons";
import { FaHashtag } from "react-icons/fa6";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

export default function SortMenu() {
  return (
    <Menu>
      <MenuButton
        className="menu-btn"
        as={IconButton}
        icon={<Icon as={FaHashtag} />}
      />
      <MenuList>
        <RadioGroup>
          <Stack>
            <Radio colorScheme="red" value="number">
              Number
            </Radio>
            <Radio colorScheme="red" value="name">
              Name
            </Radio>
          </Stack>
        </RadioGroup>
      </MenuList>
    </Menu>
  );
}

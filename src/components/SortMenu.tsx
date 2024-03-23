import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { SortCriteria, SortMenuProps } from "../data/common";
import { FaHashtag } from "react-icons/fa";

export default function SortMenu({ sort, setSort }: SortMenuProps) {
  return (
    <Menu isLazy defaultIsOpen={true}>
      {({ isOpen }) => (
        <>
          <MenuButton
            className="menu-btn"
            isActive={isOpen}
            as={IconButton}
            icon={<Icon as={FaHashtag} />}
          />
          <MenuList>
            <MenuOptionGroup
              defaultValue={sort.type}
              title="Type"
              type="checkbox"
            >
              <MenuItemOption
                onClick={() => {
                  setSort((prev: SortCriteria) => ({
                    ...prev,
                    type: "number",
                  }));
                }}
                value="number"
              >
                Number
              </MenuItemOption>
              <MenuItemOption
                onClick={() => {
                  setSort((prev: SortCriteria) => ({ ...prev, type: "name" }));
                }}
                value="name"
              >
                Name
              </MenuItemOption>
            </MenuOptionGroup>
            <MenuOptionGroup
              defaultValue={sort.order}
              title="Order"
              type="checkbox"
            >
              <MenuItemOption
                onClick={() => {
                  setSort((prev: SortCriteria) => ({ ...prev, order: "asc" }));
                }}
                value="asc"
              >
                Ascending
              </MenuItemOption>
              <MenuItemOption
                onClick={() => {
                  setSort((prev: SortCriteria) => ({ ...prev, order: "desc" }));
                }}
                value="desc"
              >
                Descending
              </MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
}

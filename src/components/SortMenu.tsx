import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { HiOutlineSortDescending, HiSortAscending } from "react-icons/hi";

import { SortCriteria, SortMenuProps } from "../data/common";
import { BiRename } from "react-icons/bi";
import { GoNumber } from "react-icons/go";
import { FaSort } from "react-icons/fa";

export default function SortMenu({ sort, setSort }: SortMenuProps) {
  return (
    <Menu isLazy defaultIsOpen={false}>
      {({ isOpen }) => (
        <>
          <MenuButton
            className={isOpen ? "menu-btn-open" : "menu-btn-close"}
            isActive={isOpen}
            as={IconButton}
            icon={<Icon as={FaSort} />}
          />
          <MenuList>
            <MenuOptionGroup defaultValue={sort.type} title="Type">
              <MenuItemOption
                icon={<Icon as={GoNumber} />}
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
                icon={<Icon as={BiRename} />}
                onClick={() => {
                  setSort((prev: SortCriteria) => ({ ...prev, type: "name" }));
                }}
                value="name"
              >
                Name
              </MenuItemOption>
            </MenuOptionGroup>
            <MenuOptionGroup defaultValue={sort.order} title="Order">
              <MenuItemOption
                icon={<Icon as={HiSortAscending} />}
                onClick={() => {
                  setSort((prev: SortCriteria) => ({ ...prev, order: "asc" }));
                }}
                value="asc"
              >
                Ascending
              </MenuItemOption>
              <MenuItemOption
                icon={<Icon as={HiOutlineSortDescending} />}
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

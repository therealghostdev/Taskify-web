import React from "react";
import Button from "./Button";
import { Fab, Popper, Tooltip } from "@mui/material";
import {
  usePopperContext,
  useThemeContext,
} from "../../utils/app_context/general";
import actions from "./actions";
import { toast } from "react-toastify";

export default function SimplePopper() {
  const { toggleActionState, actionsState } = usePopperContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [display, setDisplay] = React.useState<boolean>(true);
  const { darkMode } = useThemeContext();

  const toggleBtnIcon = () => {
    setDisplay((prev) => !prev);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    toggleBtnIcon();
  };

  const customId = "1";
  const notify = (message: string) => {
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });
  };

  const handleActionClick = (actionName: string) => {
    const actions = ["notepad", "save", "print", "share"];

    const isAnyModalOpen = actions.some((action) => actionsState[action]);

    if (isAnyModalOpen) {
      return notify(`A tool modal is opened, close to continue!`);
    }

    toggleActionState(actionName);
    setAnchorEl(null);
    toggleBtnIcon();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <div>
      <Button onClick={handleClick} display={display} />
      <Popper id={id} open={open} anchorEl={anchorEl} sx={{ zIndex: 1000 }}>
        <div className="flex flex-col gap-2 py-3">
          {actions.map((action) => (
            <Tooltip title={action.name} placement="right" key={action.name}>
              <Fab
                size="small"
                onClick={() => handleActionClick(action.name.toLowerCase())}
              >
                {action.icon}
              </Fab>
            </Tooltip>
          ))}
        </div>
      </Popper>
    </div>
  );
}

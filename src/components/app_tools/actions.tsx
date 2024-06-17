import { Edit, Print, Save, Share } from "@mui/icons-material";

const actions = [
  { icon: <Edit />, name: "Notepad" },
  { icon: <Save />, name: "Save" },
  { icon: <Print />, name: "Print" },
  { icon: <Share />, name: "Share" },
];

export default actions;

export type ActionsState = {
  [key: string]: boolean;
};

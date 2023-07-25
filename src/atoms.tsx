import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface IToDo {
  id: number;
  text: string;
  edit: boolean;
}

interface IToDoState {
  [key: string]: IToDo[];
}

const { persistAtom } = recoilPersist();

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});

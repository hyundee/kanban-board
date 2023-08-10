import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { useSetRecoilState } from "recoil";
import DraggableCard from "./DraggableCard";
import { IToDo, toDoState } from "../atoms";

interface IAreaProps {
  $isDraggingOver: boolean;
  $isDraggingFromThis: boolean;
}

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

const Wrapper = styled.div`
  width: 100%;
  padding: 20px 0 20px 0;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Button = styled.button`
  background-color: transparent;
  padding: 0;
  font-size: 15px;
  width: 100%;
  height: 40px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s linear;
  &:hover {
    background-color: #fc7878;
  }
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "#b8d2f1"
      : props.$isDraggingFromThis
      ? "#c8d0d7"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 78%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;

const Board = ({ toDos, boardId }: IBoardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onVaild = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
      edit: false,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newTodo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };
  const onDelete = () => {
    setToDos((allBoards) => {
      const copyBoards = { ...allBoards };
      delete copyBoards[boardId];
      return { ...copyBoards };
    });
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onVaild)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            $isDraggingOver={info.isDraggingOver}
            $isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                idx={index}
                toDoText={toDo.text}
                toDoId={toDo.id}
                boardId={boardId}
                edit={toDo.edit}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
      {boardId !== "To Do" && boardId !== "Doing" && boardId !== "Done" && (
        <Button onClick={onDelete}>
          <span className="material-icons-round">delete</span>
        </Button>
      )}
    </Wrapper>
  );
};

export default Board;

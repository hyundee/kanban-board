import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { toDoState } from "../atoms";

interface IDraggableCardProps {
  idx: number;
  toDoId: number;
  toDoText: string;
  boardId: string;
  edit: boolean;
}

interface IForm {
  toDo: string;
}

const Card = styled.div<{ $isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 8px 8px 8px 15px;
  background-color: ${(props) =>
    props.$isDragging ? "#8dc6ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
  &:hover {
    div {
      opacity: 1;
    }
  }
`;

const Form = styled.form`
  width: 74%;
  opacity: 1;
  input {
    width: 100%;
    font-size: 16px;
    border: 0;
    background-color: white;
    padding: 5px 5px 5px 2px;
    border-radius: 5px;
    &:focus {
      outline: none;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 26%;
  opacity: 0;
  transition: 0.15s linear;
`;

const Button = styled.button`
  background-color: white;
  padding: 0;
  font-size: 15px;
  width: 28px;
  height: 28px;
  border: none;
  cursor: pointer;
  text-align: end;
`;

const DraggableCard = ({
  idx,
  toDoId,
  toDoText,
  boardId,
  edit,
}: IDraggableCardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onVaild = ({ toDo }: IForm) => {
    setToDos((allBoards) => {
      if (toDo === "") {
        const cancelEditToDo = allBoards[boardId].map((toDo) =>
          toDo.id === toDoId ? { ...toDo, edit: !toDo.edit } : toDo
        );
        return {
          ...allBoards,
          [boardId]: cancelEditToDo,
        };
      }
      const editToDo = allBoards[boardId].map((editToDo) =>
        editToDo.id === toDoId
          ? { ...editToDo, text: toDo, edit: !editToDo.edit }
          : editToDo
      );
      return {
        ...allBoards,
        [boardId]: editToDo,
      };
    });
    setValue("toDo", "");
  };
  const onEdit = () => {
    setToDos((allBoards) => {
      const editToDo = allBoards[boardId].map((toDo) =>
        toDo.id === toDoId ? { ...toDo, edit: !toDo.edit } : toDo
      );
      return {
        ...allBoards,
        [boardId]: editToDo,
      };
    });
  };
  const onDelete = () => {
    setToDos((allBoards) => {
      const remainsTodo = allBoards[boardId].filter(
        (deleteToDo) => deleteToDo.id !== toDoId
      );
      return {
        ...allBoards,
        [boardId]: remainsTodo,
      };
    });
  };

  return (
    <Draggable index={idx} key={toDoId} draggableId={toDoId + ""}>
      {(magic, info) => (
        <Card
          $isDragging={info.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <Form onSubmit={handleSubmit(onVaild)}>
            {edit ? (
              <input
                type="text"
                placeholder={`Edit task a ${toDoText}`}
                {...register("toDo", { required: false })}
                autoFocus
              />
            ) : (
              <span>{toDoText}</span>
            )}
          </Form>
          <ButtonWrapper>
            {edit ? (
              <Button onClick={handleSubmit(onVaild)}>
                <span className="material-icons-round">check</span>
              </Button>
            ) : (
              <Button onClick={onEdit}>
                <span className="material-icons-round">edit</span>
              </Button>
            )}
            <Button onClick={onDelete}>
              <span className="material-icons-round">delete</span>
            </Button>
          </ButtonWrapper>
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);

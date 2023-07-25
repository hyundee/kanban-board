import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import GlobalStyle from "./GlobalStyle";
import Board, { Form } from "./Components/Board";
import { toDoState } from "./atoms";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
  display: flex;
  max-width: 860px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 50px;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

interface IForm {
  board: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const toDoObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, toDoObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const toDoObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, toDoObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ board }: IForm) => {
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [board]: [],
      };
    });
    setValue("board", "");
  };
  return (
    <>
      <GlobalStyle />
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Form onSubmit={handleSubmit(onValid)} style={{ width: "30%" }}>
            <input {...register("board")} type="text" placeholder="Add board" />
          </Form>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board key={boardId} boardId={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;

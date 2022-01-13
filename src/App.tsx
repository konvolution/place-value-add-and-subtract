import * as React from "react";

import "./styles.css";

import {
  generateInitialState,
  Location,
  Operation,
  Question,
  rootReducer,
  selectIsCompleted,
  selectNumberPicture,
  convertNumberPictureToNumber,
  createActionRandomQuestion
} from "./appModel";

import { NumberRepresentation } from "./NumberRepresentation";
import { usePointerTracker } from "./DragDrop/hooks/usePointerTracker";
import { composePointerEventHandlers } from "./DragDrop/composePointerEventHandlers";
import { usePointerEnterExitTracker } from "./DragDrop/hooks/usePointerEnterExitTracker";

function addText({ lhs, rhs }: Question): string {
  return `Add ${rhs} (bottom number) to ${lhs} (top number) so that the top number becomes ${lhs} + ${rhs}.`;
}

function subtractText({ lhs, rhs }: Question): string {
  return `Move ${rhs} from top number to bottom number so that the top number becomes ${lhs} - ${rhs}.`;
}

function questionText(question: Question): string {
  return question.operation === Operation.Add
    ? addText(question)
    : subtractText(question);
}

export default function App() {
  const [state, dispatch] = React.useReducer(
    rootReducer,
    undefined,
    generateInitialState
  );

  const dragEvents = composePointerEventHandlers(
    usePointerTracker(),
    usePointerEnterExitTracker()
  );

  const handleOnClick = React.useCallback(() => {
    dispatch(createActionRandomQuestion());
  }, []);

  return (
    <div className="App" {...dragEvents}>
      <h1>Place value</h1>
      <h2>{questionText(state.question)}</h2>
      <div style={{ position: "relative" }}>
        <NumberRepresentation
          appState={state}
          dispatch={dispatch}
          location={Location.Top}
        />
        <NumberRepresentation
          appState={state}
          dispatch={dispatch}
          location={Location.Bottom}
        />
        {selectIsCompleted(state) && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#80808030"
            }}
          >
            <div
              style={{
                backgroundColor: "#ee5",
                border: "2px solid black",
                padding: "50px"
              }}
            >
              <h2>
                Well done! The answer is{" "}
                {convertNumberPictureToNumber(
                  selectNumberPicture(state, Location.Top)
                )}
                {"."}
              </h2>
              <button onClick={handleOnClick}>Go to next question</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

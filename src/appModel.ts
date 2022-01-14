export interface NumberPicture {
  hundreds: number;
  tens: number;
  units: number;
}

export enum Operation {
  Add = "Add",
  Subtract = "Subtract"
}

export enum Section {
  Hundreds = "Hundreds",
  Tens = "Tens",
  Units = "Units"
}

export enum Location {
  Top = "Top",
  Bottom = "Bottom"
}

export interface Question {
  operation: Operation;
  lhs: number;
  rhs: number;
}

interface DragSource {
  section: Section;
  location: Location;
  isGroup: boolean;
}

export interface DragTarget {
  section: Section;
  location: Location;
}

export interface AppState {
  question: Question;
  firstNumber: NumberPicture;
  secondNumber: NumberPicture;
  dragSource: DragSource | undefined;
  dropTarget: DragTarget | undefined;
}

export enum ActionType {
  BeginDrag = "BeginDrag",
  DragDrop = "DragDrop",
  CancelDrag = "CancelDrag",
  DropEnter = "DropEnter",
  DropLeave = "DropLeave",
  NextQuestion = "NextQuestion"
}

// Actions

export interface ActionBase {
  type: ActionType;
}

export interface ActionBeginDrag extends ActionBase {
  type: ActionType.BeginDrag;
  dragSource: DragSource;
}

export interface ActionDragDrop extends ActionBase {
  type: ActionType.DragDrop;
  dragTarget: DragTarget;
}

export interface ActionCancelDrag extends ActionBase {
  type: ActionType.CancelDrag;
}

export interface ActionDropEnter extends ActionBase {
  type: ActionType.DropEnter;
  target: DragTarget;
}

export interface ActionDropLeave extends ActionBase {
  type: ActionType.DropLeave;
}

export interface ActionNextQuestion extends ActionBase {
  type: ActionType.NextQuestion;
  question: Question;
}

export type Action =
  | ActionBeginDrag
  | ActionDragDrop
  | ActionCancelDrag
  | ActionDropEnter
  | ActionDropLeave
  | ActionNextQuestion;

// Helper functions

function convertNumberToPicture(value: number): NumberPicture {
  const units = value % 10;

  value = Math.floor(value / 10);

  const tens = value % 10;

  return {
    hundreds: Math.floor(value / 10),
    tens,
    units
  };
}

export function convertNumberPictureToNumber(value: NumberPicture): number {
  return (
    value.hundreds * 100 +
    (value.tens >= 10 ? 0 : value.tens) * 10 +
    (value.units >= 10 ? 0 : value.units)
  );
}

// Does the number picture represent a valid number?
// Note: we assume only valid number pictures, so we don't check things
// like negative numbers in a section
export function isValidNumber(value: NumberPicture): boolean {
  return value.hundreds < 10 && value.tens < 10 && value.units < 10;
}

export function isEqualDragTarget(
  target1: DragTarget,
  target2: DragTarget
): boolean {
  return (
    target1.location === target2.location && target1.section === target2.section
  );
}

function addToNumber(
  value: NumberPicture,
  section: Section,
  amountToAdd: number
): NumberPicture {
  const result: NumberPicture = {
    ...value
  };

  switch (section) {
    case Section.Hundreds:
      result.hundreds += amountToAdd;
      break;

    case Section.Tens:
      result.tens += amountToAdd;
      break;

    case Section.Units:
      result.units += amountToAdd;
      break;
  }

  return result;
}

// Action creators

export function createActionBeginDrag(dragSource: DragSource): ActionBeginDrag {
  return {
    type: ActionType.BeginDrag,
    dragSource
  };
}

export function createActionDragDrop(dragTarget: DragTarget): ActionDragDrop {
  return {
    type: ActionType.DragDrop,
    dragTarget
  };
}

export function createActionCancelDrag(): ActionCancelDrag {
  return {
    type: ActionType.CancelDrag
  };
}

export function createActionDropEnter(target: DragTarget): ActionDropEnter {
  return {
    type: ActionType.DropEnter,
    target
  };
}

export function createActionDropLeave(): ActionDropLeave {
  return {
    type: ActionType.DropLeave
  };
}

export function createActionNextQuestion(
  question: Question
): ActionNextQuestion {
  return {
    type: ActionType.NextQuestion,
    question
  };
}

// Selectors

// Returns if dragTarget is a valid drop target
export function selectIsValidDropTarget(
  state: AppState,
  dragTarget: DragTarget
): boolean {
  const { dragSource, firstNumber, secondNumber } = state;

  if (!dragSource) {
    return false;
  }

  if (dragSource.isGroup) {
    if (dragSource.location !== Location.Top) {
      return false;
    }

    if (dragTarget.location !== Location.Top) {
      return false;
    }

    switch (dragTarget.section) {
      case Section.Hundreds:
        return (
          dragSource.section === Section.Tens &&
          firstNumber.tens >= 10 &&
          firstNumber.hundreds === 0
        );
      case Section.Tens:
        return (
          dragSource.section === Section.Units &&
          firstNumber.units >= 10 &&
          firstNumber.tens < 19
        );
      case Section.Units:
        return false;
    }

    // Shouldn't be reached
    return false;
  }

  // Moving a single block - different numbers
  if (dragSource.location !== dragTarget.location) {
    // If moving between numbers, only allow dragging to the same level
    if (dragSource.section !== dragTarget.section) {
      return false;
    }

    const { sourceNumber, targetNumber } =
      dragSource.location === Location.Top
        ? { sourceNumber: firstNumber, targetNumber: secondNumber }
        : { sourceNumber: secondNumber, targetNumber: firstNumber };

    switch (dragSource.section) {
      case Section.Hundreds:
        return sourceNumber.hundreds >= 1 && targetNumber.hundreds === 0;
      case Section.Tens:
        return sourceNumber.tens >= 1 && targetNumber.tens < 19;
      case Section.Units:
        return sourceNumber.units >= 1 && targetNumber.units < 19;
    }

    // Shouldn't be reached
    return false;
  }

  // Moving a single block within the same number
  if (dragSource.location !== Location.Top) {
    // Only allow moving number blocks between sections for the first number
    return false;
  }

  // Moving a single block within the first number
  switch (dragSource.section) {
    case Section.Hundreds:
      return (
        dragTarget.section === Section.Tens &&
        firstNumber.hundreds > 0 &&
        firstNumber.tens < 10
      );
    case Section.Tens:
      return (
        dragTarget.section === Section.Units &&
        firstNumber.tens > 0 &&
        firstNumber.units < 10
      );
    case Section.Units:
      return false;
  }

  // Shouldn't be reached
  return false;
}

export function selectPreviewAdd(
  state: AppState,
  dragTarget: DragTarget
): number {
  if (!state.dropTarget) {
    return 0;
  }

  if (!isEqualDragTarget(dragTarget, state.dropTarget)) {
    return 0;
  }

  if (!selectIsValidDropTarget(state, dragTarget)) {
    return 0;
  }

  if (!state.dragSource) {
    return 0;
  }

  if (state.dragSource.isGroup) {
    return 1;
  }

  if (state.dragSource.location === dragTarget.location) {
    return 10;
  }

  return 1;
}

export function selectIsCompleted(state: AppState): boolean {
  if (!isValidNumber(state.firstNumber) || !isValidNumber(state.secondNumber)) {
    return false;
  }

  const firstNumber = convertNumberPictureToNumber(state.firstNumber);

  const add = (x: number, y: number) => x + y;
  const sub = (x: number, y: number) => x - y;

  const op = state.question.operation === Operation.Add ? add : sub;

  return firstNumber === op(state.question.lhs, state.question.rhs);
}

export function selectNumberPicture(
  state: AppState,
  location: Location
): NumberPicture {
  return location === Location.Top ? state.firstNumber : state.secondNumber;
}

// Reducers

export function rootReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.NextQuestion: {
      return {
        question: action.question,
        firstNumber: convertNumberToPicture(action.question.lhs),
        secondNumber: convertNumberToPicture(
          action.question.operation === Operation.Add ? action.question.rhs : 0
        ),
        dragSource: undefined,
        dropTarget: undefined
      };
    }

    case ActionType.BeginDrag: {
      return {
        ...state,
        dragSource: action.dragSource
      };
    }

    case ActionType.CancelDrag: {
      return {
        ...state,
        dragSource: undefined,
        dropTarget: undefined
      };
    }

    case ActionType.DropEnter: {
      return {
        ...state,
        dropTarget: action.target
      };
    }

    case ActionType.DropLeave: {
      return {
        ...state,
        dropTarget: undefined
      };
    }

    case ActionType.DragDrop: {
      if (
        !selectIsValidDropTarget(state, action.dragTarget) ||
        !state.dragSource
      ) {
        return state;
      }
      const addAmount = selectPreviewAdd(state, action.dragTarget);
      const subtractAmount = state.dragSource.isGroup ? 10 : 1;

      let newFirstNumber: NumberPicture = state.firstNumber;
      let newSecondNumber: NumberPicture = state.secondNumber;

      switch (action.dragTarget.location) {
        case Location.Top:
          newFirstNumber = addToNumber(
            newFirstNumber,
            action.dragTarget.section,
            addAmount
          );
          break;

        case Location.Bottom:
          newSecondNumber = addToNumber(
            newSecondNumber,
            action.dragTarget.section,
            addAmount
          );
      }

      if (state.dragSource) {
        switch (state.dragSource.location) {
          case Location.Top:
            newFirstNumber = addToNumber(
              newFirstNumber,
              state.dragSource.section,
              -subtractAmount
            );
            break;

          case Location.Bottom:
            newSecondNumber = addToNumber(
              newSecondNumber,
              state.dragSource.section,
              -subtractAmount
            );
        }
      }

      return {
        ...state,
        firstNumber: newFirstNumber,
        secondNumber: newSecondNumber,
        dragSource: undefined,
        dropTarget: undefined
      };
    }
  }

  return state;
}

// Question generator

function generateRandomQuestion(): Question {
  const operation: Operation =
    Math.random() >= 0.5 ? Operation.Add : Operation.Subtract;

  const lhs = Math.floor(Math.random() * 100);
  const rhs = Math.floor(
    Math.random() * (operation === Operation.Add ? 100 : lhs + 1)
  );

  return {
    operation,
    lhs,
    rhs
  };
}

export function generateInitialState(): AppState {
  const dummyState: AppState = {
    question: generateRandomQuestion(),
    firstNumber: convertNumberToPicture(0),
    secondNumber: convertNumberToPicture(0),
    dragSource: undefined
  };

  return rootReducer(dummyState, createActionNextQuestion(dummyState.question));
}

export function createActionRandomQuestion(): ActionNextQuestion {
  return createActionNextQuestion(generateRandomQuestion());
}

import "./styles.css";
import * as React from "react";

import { UnitsPicture } from "./UnitsPicture";
import { TensPicture } from "./TensPicture";
import { HundredsBrick } from "./HundredsBrick";
import { PlaceSection } from "./PlaceSection";

import {
  Location,
  AppState,
  Action,
  selectIsValidDropTarget,
  Section,
  createActionDragDrop,
  createActionDropEnter,
  createActionDropLeave,
  createActionBeginDrag,
  createActionCancelDrag,
  selectPreviewAdd,
  NumberPicture,
  convertNumberPictureToNumber,
  selectNumberPicture
} from "./appModel";

export interface NumberRepresentationProps {
  location: Location;
  appState: AppState;
  dispatch: React.Dispatch<Action>;
}

function convertPictureDigitToText(digit: number): React.ReactNode {
  return (
    <>
      &nbsp;
      {digit >= 10 && <sup className="OverflowDigit">1</sup>}
      {digit % 10}
    </>
  );
}

function convertNumberPictureToText(value: NumberPicture): React.ReactNode {
  const num = convertNumberPictureToNumber(value);
  return (
    <>
      {num < 100 && value.hundreds === 0 ? (
        <span className="HiddenDigit">0</span>
      ) : (
        convertPictureDigitToText(value.hundreds)
      )}
      {num < 10 && value.tens === 0 ? (
        <span className="HiddenDigit">0</span>
      ) : (
        convertPictureDigitToText(value.tens)
      )}
      {convertPictureDigitToText(value.units)}
    </>
  );
}

export const NumberRepresentation: React.FunctionComponent<NumberRepresentationProps> = ({
  location,
  appState,
  dispatch
}) => {
  const ghostOneHundred =
    selectPreviewAdd(appState, {
      location,
      section: Section.Hundreds
    }) > 0;

  return (
    <div className="Horizontal">
      <PlaceSection
        isValidDropTarget={selectIsValidDropTarget(appState, {
          location,
          section: Section.Hundreds
        })}
        onDragDrop={() =>
          dispatch(
            createActionDragDrop({
              location,
              section: Section.Hundreds
            })
          )
        }
        onDragEnter={() =>
          dispatch(
            createActionDropEnter({
              location,
              section: Section.Hundreds
            })
          )
        }
        onDragLeave={() => dispatch(createActionDropLeave())}
      >
        <HundredsBrick
          hide={
            selectNumberPicture(appState, location).hundreds === 0 &&
            !ghostOneHundred
          }
          ghost={ghostOneHundred}
          onBeginDrag={() =>
            dispatch(
              createActionBeginDrag({
                isGroup: false,
                location,
                section: Section.Hundreds
              })
            )
          }
          onEndDrag={() => dispatch(createActionCancelDrag())}
        />
      </PlaceSection>
      <PlaceSection
        isValidDropTarget={selectIsValidDropTarget(appState, {
          location,
          section: Section.Tens
        })}
        onDragDrop={() =>
          dispatch(
            createActionDragDrop({
              location,
              section: Section.Tens
            })
          )
        }
        onDragEnter={() =>
          dispatch(
            createActionDropEnter({
              location,
              section: Section.Tens
            })
          )
        }
        onDragLeave={() => dispatch(createActionDropLeave())}
      >
        <TensPicture
          value={selectNumberPicture(appState, location).tens}
          previewAdd={selectPreviewAdd(appState, {
            location,
            section: Section.Tens
          })}
          onBeginDragGroup={() =>
            dispatch(
              createActionBeginDrag({
                isGroup: true,
                location,
                section: Section.Tens
              })
            )
          }
          onBeginDragItem={() =>
            dispatch(
              createActionBeginDrag({
                isGroup: false,
                location,
                section: Section.Tens
              })
            )
          }
          onEndDrag={() => dispatch(createActionCancelDrag())}
        />
      </PlaceSection>
      <PlaceSection
        isValidDropTarget={selectIsValidDropTarget(appState, {
          location,
          section: Section.Units
        })}
        onDragDrop={() =>
          dispatch(
            createActionDragDrop({
              location,
              section: Section.Units
            })
          )
        }
        onDragEnter={() =>
          dispatch(
            createActionDropEnter({
              location,
              section: Section.Units
            })
          )
        }
        onDragLeave={() => dispatch(createActionDropLeave())}
      >
        <UnitsPicture
          value={selectNumberPicture(appState, location).units}
          previewAdd={selectPreviewAdd(appState, {
            location,
            section: Section.Units
          })}
          onBeginDragGroup={() =>
            dispatch(
              createActionBeginDrag({
                isGroup: true,
                location,
                section: Section.Units
              })
            )
          }
          onBeginDragItem={() =>
            dispatch(
              createActionBeginDrag({
                isGroup: false,
                location,
                section: Section.Units
              })
            )
          }
          onEndDrag={() => dispatch(createActionCancelDrag())}
        />
      </PlaceSection>
      <h1 className="ResultNumber">
        {convertNumberPictureToText(selectNumberPicture(appState, location))}
      </h1>
    </div>
  );
};

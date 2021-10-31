import { UnitBrick } from "./UnitBrick";
import { placeValuePictureFactory } from "./PlaceValuePicture";

export const UnitsPicture = placeValuePictureFactory(
  "Horizontal",
  "Vertical",
  "UnitsGroup",
  UnitBrick
);

UnitsPicture.displayName = "UnitsPicture";

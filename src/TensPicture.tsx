import { TensBrick } from "./TensBrick";
import { placeValuePictureFactory } from "./PlaceValuePicture";

export const TensPicture = placeValuePictureFactory(
  "Vertical",
  "Horizontal",
  "TensGroup",
  TensBrick
);

TensPicture.displayName = "TensPicture";

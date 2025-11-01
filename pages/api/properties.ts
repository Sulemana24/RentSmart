import { PROPERTYLISTINGSAMPLE } from "@/constants";

export default function handler(req, res) {
  res.status(200).json(PROPERTYLISTINGSAMPLE);
}

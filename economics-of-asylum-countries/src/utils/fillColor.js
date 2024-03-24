import { incoming_refugee_data, outgoing_refugee_data } from "./data_parser";


export const getFillColor = (
  contentType,
  currentYear,
  incomingColors,
  outgoingColors,
  netDifferenceColors,
  d
) => {
  if (contentType == "None") return "white";
  else if (contentType == "Incoming refugees")
    return incoming_refugee_data[currentYear][d.id]
      ? incomingColors(incoming_refugee_data[currentYear][d.id])
      : "white";
  else if (contentType == "Outgoing refugees")
    return outgoing_refugee_data[currentYear][d.id]
      ? outgoingColors(outgoing_refugee_data[currentYear][d.id]["Count"])
      : "white";
  else {
    if (incoming_refugee_data[currentYear][d.id]) {
      if (outgoing_refugee_data[currentYear][d.id])
        return netDifferenceColors(
          outgoing_refugee_data[currentYear][d.id]["Count"] -
            incoming_refugee_data[currentYear][d.id]
        );
      else
        return netDifferenceColors(-incoming_refugee_data[currentYear][d.id]);
    } else {
      if (outgoing_refugee_data[currentYear][d.id])
        return netDifferenceColors(
          outgoing_refugee_data[currentYear][d.id]["Count"]
        );
      else return "white";
    }
  }
};

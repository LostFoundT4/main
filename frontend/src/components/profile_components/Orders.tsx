import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  lastSeenTime: string,
  lastSeenLocation: string,
) {
  return { id, date, name, shipTo: lastSeenTime, paymentMethod: lastSeenLocation};
}

const rows = [
  createData(
    0,
    "16/7/2023",
    "Water Bottle",
    "1 pm",
    "SOE",
  ),
  createData(
    1,
    "16/7/2023",
    "Water Bottle",
    "1 pm",
    "SOE",
  ),
  createData(
    2,
    "16/7/2023",
    "Water Bottle",
    "1 pm",
    "SOE",
  ),
  createData(
    3,
    "16/7/2023",
    "Water Bottle",
    "1 pm",
    "SOE",
  ),
  createData(
    4,
    "16/7/2023",
    "Water Bottle",
    "1 pm",
    "SOE",
  ),
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Orders() {
  return (
    <React.Fragment>
      <Title>Recent Lost Items</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Last Seen Time</TableCell>
            <TableCell>Last Seen Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more lost items
      </Link>
    </React.Fragment>
  );
}

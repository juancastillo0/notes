import React from "react";

export default function Table() {
  return (
    <table id="table" className="table table-sm">
      <thead id="table-head">
        <tr>
          <th>Variable</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody id="table-body">
        <tr>
          <td>vel</td>
          <td>5</td>
        </tr>
        <tr>
          <td>temp</td>
          <td>34</td>
        </tr>
        <tr>
          <td>y</td>
          <td>1207</td>
        </tr>
      </tbody>
    </table>
  );
}

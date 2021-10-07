import axios from "axios";
import XLSX from "xlsx";

export async function getActualHospitalization() {
  const response = await axios.get(
    `https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/Aktuell_Deutschland_COVID-19-Hospitalisierungen.csv`,
    {
      responseType: "arraybuffer",
    }
  );
  const data = response.data;
  const workbook = XLSX.read(data, {
    type: "buffer",
    codepage: 65001,
    raw: true,
  });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<{
    date: string;
    state: string;
    id: string;
    ageGroup: string;
    cases7days: string;
    incidence7days: string;
  }>(sheet, {
    header: ["date", "state", "id", "ageGroup", "cases7days", "incidence7days"],
    range: 1,
  });
  const meta = await axios.get(
    `https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/.zenodo.json`
  );
  const lastUpdate = meta.data.publication_date;
  const tempDate = lastUpdate.split("T");
  const todayData = json.filter((element) => element.date === tempDate[0]);
  let actualHospitalizationData = [];
  // get all keys
  const actualData = Object.keys(todayData);
  actualData.forEach((key) => {
    const id = +todayData[key].id;
    const ageGroup = todayData[key].ageGroup;
    const cases7days = +todayData[key].cases7days;
    const incidence7days = +todayData[key].incidence7days;
    actualHospitalizationData.push({
      id,
      ageGroup,
      cases7days,
      incidence7days,
    });
  });

  return {
    data: actualHospitalizationData,
    lastUpdate: new Date(lastUpdate),
  };
}

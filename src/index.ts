import fetch from "node-fetch";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

interface HyperliquidApiResponse {
  timestamp: number;
  balance: number;
  unrealizedPnL: number;
  accountEquity: number;
  crossAccountLeverage: number;
}

async function queryHyperliquidAPI(
  accountAddress: string
): Promise<HyperliquidApiResponse> {
  var resData = <HyperliquidApiResponse>{};

  try {
    const response = await axios.post(
      "https://api-ui.hyperliquid-testnet.xyz/info",
      {
        type: "clearinghouseState",
        user: accountAddress,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    resData.timestamp = response.data.time;
    resData.balance = response.data.withdrawable;
    resData.unrealizedPnL = 0.0;
    resData.accountEquity = response.data.marginSummary.accountValue;
    resData.crossAccountLeverage =
      response.data.crossMarginSummary.accountValue;
    return resData;
  } catch (error: any) {
    throw new Error(`Failed to query Hyperliquid API: ${error.message}`);
  }
}

// Function to convert object to CSV row
function convertToCSVRow(obj: Record<string, any>): string {
  const values = Object.values(obj);
  return values.map((value) => `"${value}"`).join(",");
}

// Function to convert array of objects to CSV content
function convertToCSV(data: Record<string, any>[]): string {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((obj) => convertToCSVRow(obj)).join("\n");
  return `${headers}\n${rows}`;
}

async function loads() {
  const currentTimestamp = Date.now();

  try {

    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "candleSnapshot",
        req: {
          coin: "ETH",
          interval: "1m",
          startTime: 1534550400000,
          endTime: currentTimestamp,
        },
      }),
    });
    const data: any = await response.json();

    const csvContent = convertToCSV(data);

    fs.writeFile(ethCandlesPath, csvContent, (err) => {
      if (err) {
        console.error("Error writing to CSV:", err);
      } else {
        console.log("CSV file saved successfully.");
      }
    });

  } catch (error: any) {
    throw new Error(`Failed to query Hyperliquid API: ${error.message}`);
  }
}

function writeToCSV(filePath: string, data: HyperliquidApiResponse): void {
  const csvHeader =
    "Timestamp,Balance,UnrealizedPnL,AccountEquity,CrossAccountLeverage";
  const csvData = `${data.timestamp},${data.balance},${data.unrealizedPnL},${data.accountEquity},${data.crossAccountLeverage}`;

  // Check if the file exists
  const fileExists = fs.existsSync(filePath);

  // If the file exists, append a new line; otherwise, create a new file with the header
  if (fileExists) {
    fs.appendFileSync(filePath, `\n${csvData}`);
  } else {
    fs.writeFileSync(filePath, `${csvHeader}\n${csvData}`);
  }
}

const accountAddress = "0x4CAa98cdC045c7D4bC80999d42D005A86Bd2A025";
const csvFilePath = "account_data.csv";
const ethCandlesPath = "src/eth_data.csv";

loads();

/*
queryHyperliquidAPI(accountAddress)
  .then((responseData) => {
    writeToCSV(csvFilePath, responseData);
    console.log('Data has been written to the CSV file.');
  })
  .catch((error) => console.error(error));
*/

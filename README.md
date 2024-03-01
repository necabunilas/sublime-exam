# Notes
1. I created a ts project
2. Need to run <b>npm start<b> to run the script
3. I only found timestamp and balance in the data response based from the documentation: <a>https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint</a>
4. The data response is like this:
  ``` 
  assetPositions: [],
  crossMaintenanceMarginUsed: '0.0',
  crossMarginSummary: {
    accountValue: '0.0',
    totalMarginUsed: '0.0',
    totalNtlPos: '0.0',
    totalRawUsd: '0.0'
  },
  marginSummary: {
    accountValue: '0.0',
    totalMarginUsed: '0.0',
    totalNtlPos: '0.0',
    totalRawUsd: '0.0'
  },
  time: 1709305407197,
  withdrawable: '0.0'
  ```
5. I just matched the data like this so that I can write something to the csv file
 ```
 resData.timestamp = response.data.time;
 resData.balance = response.data.withdrawable;
 resData.unrealizedPnL = 0.0;
 resData.accountEquity = response.data.marginSummary.accountValue;
 resData.crossAccountLeverage = response.data.crossMarginSummary.accountValue;
 ```
  

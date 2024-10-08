//beacause we have limited amount of api calls ie. 25 per day so i am using demo api
function FormatChart ({stockData}) {
    if (!stockData) return [];
    
    const formattedData = [];
    Object.entries(stockData).map(([key, value]) => {
        formattedData.push({
            x:key,
            y:[
                value['1. open'],
                value['2. high'],
                value['3. low'],
                value['4. close'],
            ]
        })
    });
    return formattedData;
}

export default FormatChart;